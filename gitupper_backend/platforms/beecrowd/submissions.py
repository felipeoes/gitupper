import concurrent.futures
import time

from bs4 import BeautifulSoup
from lxml import etree

from platforms.submissions_saver import save_submissions


from .config import *
from gitupper.models import BeeUser, BeeSubmission, TemporaryProgress
from platforms.utils.commons import *
from platforms.utils.files import *
from platforms.user import BeecrowdUser
from .selenium_helper import retrieve_judge_session


def read_categories_file(path="categories.json"):
    with open(path, "r", encoding="utf-8") as read_file:
        categories_dict = json.load(read_file)
    return categories_dict


class BeecrowdSubmissionsFetcher:
    def __init__(self, user: BeecrowdUser, options=None, gitupper_id: int = None):
        self.__user = user
        self.__options = options
        self.__gitupper_id = gitupper_id
        self.__html_parser = etree.HTMLParser()
        self.submissions_obj = []
        self.filtered_submissions = {
            'accepted': [],
            'not_accepted': [],
        }
        self.percent = 0
        self.n_pages = -1

    @property
    def user(self):
        return self.__user

    @property
    def options(self):
        return self.__options

    @property
    def gitupper_id(self):
        return self.__gitupper_id

    @property
    def html_parser(self):
        return self.__html_parser

    def get_submission_source_code(self, submission_url: str):
        RETRIES = 3
        for _ in range(RETRIES):
            try:
                req = self.user.active_session
                response = req.make_request(submission_url)

                source_code = BeautifulSoup(response).find("pre").text
                stripped_source_code = source_code.replace("\n", "", 1)

                return stripped_source_code
            except Exception as e:
                print(f"Exceção: {e} | URL: {submission_url}")
                time.sleep(30)
                continue

    def get_submission_info(self, submission_fields, categories):
        submission_code_url = beecrowd_submissions_url + \
            "/code/{}".format(submission_fields[0])
        source_code = self.get_submission_source_code(
            submission_code_url)

        submission_obj = {
            "id": submission_fields[0],
            "problem_number": submission_fields[1],
            "problem_name": submission_fields[2],
            "category": categories[submission_fields[1]],
            "status": submission_fields[3],
            "prog_language": submission_fields[4],
            "time": submission_fields[5],
            "date_submitted": submission_fields[6],
            "source_code": source_code,
        }

        formatted_prog_language = format_prog_language(
            submission_obj['prog_language'])
        formatted_problem_name = format_problem_name(
            submission_obj['problem_name'])
        filename = format_filename(
            submission_obj["problem_number"], formatted_problem_name, formatted_prog_language)

        submission_obj['filename'] = filename
        self.submissions_obj.append(submission_obj)

        if submission_obj['status'] != "Accepted":
            self.filtered_submissions['not_accepted'].append(submission_obj)
        else:
            self.filtered_submissions['accepted'].append(submission_obj)

        return submission_obj

    def get_submission_fields(self, submission_row):
        submission_fields = [data.text.strip()
                             for data in submission_row.findAll('td')]
        submission_fields.remove('')

        return submission_fields

    def extract_submissions(self, response: str, categories, temp_progress: TemporaryProgress):
        retry_list = []
        submissions_tr = []

        soup = BeautifulSoup(response)
        rows = soup.find('table').findAll('tr')[1:-1]
        for row in rows:
            try:
                submission_fields = self.get_submission_fields(row)
                submissions_tr.append(submission_fields)
            except Exception as e:
                print(e)
                retry_list.append(row)

        if len(retry_list) > 0:
            time.sleep(30)
            for row in retry_list:
                submission_fields = self.get_submission_fields(row)
                submissions_tr.append(submission_fields)

        with concurrent.futures.ThreadPoolExecutor() as submissions_executor:
            {submissions_executor.submit(self.get_submission_info, submission,
                                         categories): submission for submission in submissions_tr}

        self.percent += round(1 / self.n_pages * 100)
        print("{}%".format(self.percent))
        temp_progress.value = self.percent
        temp_progress.save()

        return self.submissions_obj

    def get_submissions_response(self, url):
        req = self.user.active_session
        response = req.make_request(url)
        return response

    def fetch_submissions(self):
        req = self.user.active_session
        response = req.make_request(beecrowd_submissions_url)

        tree = etree.fromstring(response, self.html_parser)

        table_blocked = len(tree.xpath('//*[@id="table-info"]')) <= 0
        complete_profile = response.find("complete-bar")

        if table_blocked and complete_profile:
            response = {
                "error": "Você precisa completar seu perfil no beecrowd para acessar suas submissões."
            }

            return response

        self.n_pages = int(tree.xpath('//*[@id="table-paging"]/li[4]/a')[0].attrib['href'].split("=")[-1])

        beecrowd_user = BeeUser.objects.get(bee_id=self.user.bee_id)

        temp_progress = TemporaryProgress(
            value=self.percent, gitupper_id=self.gitupper_id)
        temp_progress.save()

        urls = [f"{beecrowd_submissions_url}?page={page_num}" for page_num in range(
            1, self.n_pages + 1)]

        categories = read_categories_file("categories.json")

        with concurrent.futures.ThreadPoolExecutor() as pages_executor:
            responses = {pages_executor.submit(self.get_submissions_response, url
                                               ): url for url in urls}

        with concurrent.futures.ThreadPoolExecutor() as executor:
            {executor.submit(self.extract_submissions, response, categories, temp_progress): response for page, response in enumerate(
                [res.result() for res in concurrent.futures.as_completed(responses)])}

        completed, not_done = concurrent.futures.wait(
            responses, return_when=concurrent.futures.ALL_COMPLETED)

        for future in not_done:
            print(f"{future.result()}")

        executor.shutdown(wait=True)

        save_submissions(self.submissions_obj, 'bee', beecrowd_user)

        temp_progress.value = 100
        temp_progress.save()

        return self.filtered_submissions

    def get_submissions(self):
        return self.fetch_submissions()
