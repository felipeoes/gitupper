
import concurrent.futures
import time
from datetime import datetime
from bs4 import BeautifulSoup
from lxml import etree

from platforms.base_submissions_fetcher import BaseSubmissionsFetcher
from platforms.submissions_saver import save_submissions, check_submissions_offset, format_datetime

from .config import *
from gitupper.models import BeeUser, TemporaryProgress
from platforms.utils.commons import *
from platforms.utils.files import *
from platforms.user import BeecrowdUser


def read_categories_file(path="categories.json"):
    with open(path, "r", encoding="utf-8") as read_file:
        categories_dict = json.load(read_file)
    return categories_dict

# Since this class implements BaseSubmissionsFetcher, it will need to implement fetch_submissions method.
# BaseSubmissionsFetcher has a get_submissions method that will call fetch_submissions and return the result.


class BeeSubmissionsFetcher(BaseSubmissionsFetcher):
    def __init__(self, user: BeecrowdUser, gitupper_id: str, options: dict = {}):
        super().__init__(user, gitupper_id, options)
        self.__html_parser = etree.HTMLParser()
        self.submissions_obj = []
        self.filtered_submissions = {
            'accepted': [],
            'not_accepted': [],
        }
        self.percent = 0
        self.n_pages = -1
        self.fetch_until = 1

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
            "problem_name": format_problem_name(submission_fields[2]),
            "category": categories[submission_fields[1]],
            "status": submission_fields[3],
            "prog_language": format_prog_language(submission_fields[4]),
            "time": submission_fields[5],
            "date_submitted": format_datetime(submission_fields[6]),
            "source_code": source_code,
        }

        filename = format_filename(
            submission_obj["problem_number"], submission_obj['problem_name'], submission_obj['prog_language'])

        submission_obj['filename'] = filename
        self.submissions_obj.append(submission_obj)

        if submission_obj['status'] != "Accepted":
            self.filtered_submissions['not_accepted'].append(
                format_submission(submission_obj, 'bee'))
        else:
            self.filtered_submissions['accepted'].append(
                format_submission(submission_obj, 'bee'))

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

        self.percent += round(1 / self.fetch_until * 100)
        print("{}%".format(self.percent))
        temp_progress.value = self.percent
        temp_progress.save()

        return self.submissions_obj

    def get_submissions_response(self, url):
        req = self.user.active_session
        response = req.make_request(url)
        return response

    def get_starting_page_from_offset(self, last_submission_datetime: datetime):
        # submissions are fetched in descending order of datetime. So newer submissions are the first ones.

        for page in range(1, self.n_pages + 1):
            response = self.get_submissions_response(
                beecrowd_submissions_page_url + "&page=" + str(page))
            soup = BeautifulSoup(response)
            rows = soup.find('table').findAll('tr')[1:-1]
            for row in rows:
                submission_fields = self.get_submission_fields(row)
                if len(submission_fields) == 0:
                    continue

                submission_datetime = format_datetime(
                    submission_fields[6])
                if submission_datetime < last_submission_datetime:
                    continue

                self.fetch_until = page
                return page

        # if there are no new submissions, return None
        return None

    def check_is_up_to_date(self, starting_page):
        # Starting page is None if there are no new submissions
        return starting_page is None

    def get_submissions(self):
        req = self.user.active_session
        response = req.make_request(beecrowd_submissions_page_url)

        tree = etree.fromstring(response, self.html_parser)

        table_blocked = len(tree.xpath('//*[@id="table-info"]')) <= 0
        complete_profile = response.find("complete-bar")

        if table_blocked and complete_profile != -1:
            response = {
                "error": "Você precisa completar seu perfil no beecrowd para acessar suas submissões."
            }

            return response

        self.n_pages = int(tree.xpath(
            '//*[@id="table-paging"]/li[4]/a')[0].attrib['href'].split("=")[1].replace('&sort', ''))

        beecrowd_user = BeeUser.objects.get(bee_id=self.user.bee_id)

        # Check if should fetch from offset
        last_submission_id, last_submission_datetime = check_submissions_offset(
            self.gitupper_id, 'bee')

        if last_submission_datetime is not None:
            fetch_until = self.get_starting_page_from_offset(
                last_submission_datetime)

            # check if there are no new submissions
            if self.check_is_up_to_date(fetch_until):
                return {"already_updated": True}

            urls = [f"{beecrowd_submissions_page_url}&page={page_num}" for page_num in range(
                1, fetch_until + 1)]
        else:
            urls = [f"{beecrowd_submissions_page_url}&page={page_num}" for page_num in range(
                1, self.n_pages + 1)]

        categories = read_categories_file("categories.json")

        # Start progress, so frontend can track it
        temp_progress = TemporaryProgress(
            value=self.percent, gitupper_id=self.gitupper_id)
        temp_progress.save()

        with concurrent.futures.ThreadPoolExecutor() as pages_executor:
            responses = {pages_executor.submit(self.get_submissions_response, url
                                               ): url for url in urls}

        pages_executor.shutdown(wait=True)

        # Since beecrowd can't handle too many requests at once, the fetching is sequential
        for page, response in enumerate([res.result() for res in concurrent.futures.as_completed(responses)]):
            self.extract_submissions(response, categories, temp_progress)

        save_submissions(self.submissions_obj, 'bee', beecrowd_user)

        temp_progress.value = 100
        temp_progress.save()

        return self.filtered_submissions['accepted'] + self.filtered_submissions['not_accepted']

    def fetch_submissions(self):
        """ Function to fetch submissions from Beecrowd platform. Retry 3 times because we rely on beecrowd's API, that seems to be unstable depending on received requests load """
        retries = 3
        while retries > 0:
            try:
                return self.get_submissions()
            except Exception as e:
                print(e)
                retries -= 1
                time.sleep(5)

        return {"error": "Ocorreu um erro ao tentar buscar suas submissões."}
