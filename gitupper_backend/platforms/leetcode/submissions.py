import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from requests_html import HTMLSession
from platforms.hackerrank.submissions import HackerSubmissionsFetcher

from platforms.utils.commons import format_submission
from gitupper.models import LeetUser, LeetSubmission, TemporaryProgress
from platforms.utils.commons import *
from platforms.utils.files import *
from platforms.user import LeetcodeUser
from platforms.submissions_saver import save_submissions, check_submissions_offset, format_datetime

from .config import leetcode_graphql_url, leetcode_submissions_url, SUBMISSIONS_LIMIT, base_headers
from .auth import LeetAuthenticator

# Leetcode will inherit from HackerRank because they have very similar APIs' response structure
class LeetSubmissionsFetcher(HackerSubmissionsFetcher):
    def __init__(self, user: LeetcodeUser, authenticator: LeetAuthenticator = None, options=None, gitupper_id: int = None):
        super().__init__(user, gitupper_id, authenticator, options)

    def get_detailed_submission(self, submission):
        title_slug = submission["title_slug"]

        # category_query_params = "operationName=questionData&variables={%22titleSlug%22:%22" + title_slug + \
        #     "%22}&query=query%20questionData($titleSlug:%20String!)%20{%20%20question(titleSlug:%20$titleSlug)%20{%20%20%20%20questionId%20%20%20%20categoryTitle%20%20__typename%20%20}}"

        # res_json = response_json_parser(self.session.get(
        #     f"{leetcode_graphql_url}/?{category_query_params}"))
        
        res_json = self.authenticator.query_graphql(
            "questionData",
            'query questionData($titleSlug: String!) { question(titleSlug: $titleSlug) { questionId categoryTitle __typename } }',
            self.session,
            variables={"titleSlug": title_slug}
        )
            
        submission["category"] = res_json["data"]["question"]["categoryTitle"]
        return submission

    def retrieve_submission(self, submission: dict, leet_user: LeetUser, temp_progress: TemporaryProgress):
        detailed_submission = self.get_detailed_submission(
            submission)

        formatted_prog_language = format_prog_language(
            detailed_submission['lang'])
        formatted_problem_name = format_problem_name(
            detailed_submission['title'])

        filename = format_filename(
            detailed_submission["question_id"], formatted_problem_name, formatted_prog_language)
        date_submitted = datetime.fromtimestamp(
            detailed_submission["timestamp"])
        leet_submission = LeetSubmission(id=detailed_submission['id'], user=leet_user, problem_name=detailed_submission['title'], problem_number=detailed_submission["question_id"], status=detailed_submission['status_display'],
                                         prog_language=detailed_submission['lang'], category=detailed_submission['category'], date_submitted=date_submitted, source_code=detailed_submission['code'], filename=filename)
        self.progress += round(1 / self.total_submissions * 100, 2)
        print(f"Progress: {self.progress}%")
        temp_progress.value = self.progress
        temp_progress.save()

        return leet_submission

    def get_starting_offset_from_submission(self, last_submission_datetime: datetime):
        # Get the starting offset from the last submission
        res_json = response_json_parser(self.session.get(
            f"{leetcode_submissions_url}/?offset=0&limit={SUBMISSIONS_LIMIT}&lastkey=", headers=base_headers))

        submissions_list = res_json["submissions_dump"]
        list_length = len(submissions_list)

        if list_length > 0:
            for index, submission in enumerate(submissions_list):
                if format_datetime(submission["timestamp"]) > last_submission_datetime:
                    inner_index = index
                    # Newer submission found. Check if the next submission is also newer than the last submission
                    while inner_index + 1 < list_length and format_datetime(submissions_list[inner_index + 1]["timestamp"]) > last_submission_datetime:
                        self.fetch_until += 1
                        inner_index += 1
                        continue
                    else:
                        self.fetch_until += 1
                        return self.fetch_until

        return None

    
    def query_submissions(self, offset: int = 0, limit: int = 1000):
        ''' Query submissions from graphql API 
        
        Example query payload:
        {"operationName":"Submissions","variables":{"offset":0,"limit":20,"lastKey":null,"questionSlug":"richest-customer-wealth"},"query":"query Submissions($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!) {\n  submissionList(offset: $offset, limit: $limit, lastKey: $lastKey, questionSlug: $questionSlug) {\n    lastKey\n    hasNext\n    submissions {\n      id\n      statusDisplay\n      lang\n      runtime\n      timestamp\n      url\n      isPending\n      memory\n      __typename\n    }\n    __typename\n  }\n}\n"}
        
        '''
        
        return self.authenticator.query_graphql(
            "Submissions", 
            'query Submissions($offset: Int!, $limit: Int!, $lastKey: String, $questionSlug: String!) {\n  submissionList(offset: $offset, limit: $limit, lastKey: $lastKey, questionSlug: $questionSlug) {\n    lastKey\n    hasNext\n    submissions {\n      id\n      titleSlug\n     title\n statusDisplay\n      lang\n      runtime\n      timestamp\n      url\n      isPending\n      memory\n      __typename\n    }\n    __typename\n  }\n}\n',
            self.session,
            variables={"offset": offset, "limit": limit, "lastKey": None, "questionSlug": ""}
        )
        
    def fetch_submissions(self):
        # Check if should fetch from offset
        last_submission_id, last_submission_datetime = check_submissions_offset(
            self.gitupper_id, 'leet')

        if last_submission_datetime is not None:
            fetch_until = self.get_starting_offset_from_submission(
                last_submission_datetime)

            if fetch_until is not None:
                self.fetch_until = fetch_until

            if self.check_is_up_to_date(fetch_until):
                return {"already_updated": True}

        try:
            res_json = response_json_parser(self.session.get(
                f"{leetcode_submissions_url}/?offset=0&limit={self.fetch_until}&lastkey="))
            
            submissions_list = res_json["submissions_dump"]
            
            # res_json = self.query_submissions(offset=0, limit=self.fetch_until)
            # submissions_list = res_json["data"]["submissionList"]["submissions"]
            
            list_length = len(submissions_list)

            if list_length > 0:
                submissions = []
                retry_list = []

                leet_user = LeetUser.objects.get(leet_id=self.user.leet_id)

                self.total_submissions = self.total_submissions if self.total_submissions > 0 else list_length

                temp_progress = TemporaryProgress(
                    value=0, gitupper_id=self.gitupper_id)
                temp_progress.save()

                with ThreadPoolExecutor() as executor:
                    responses = {executor.submit(
                        self.retrieve_submission, submission, leet_user, temp_progress): submission for submission in submissions_list}

                    for response in as_completed(responses):
                        leet_submission = response.result()
                        submissions.append(
                            format_submission(leet_submission, "leet"))

                save_submissions(submissions, "leet", leet_user)

                temp_progress.value = 100
                temp_progress.save()

                return submissions

            return res_json["submissions_dump"]
        except Exception as e:
            print(e)
            return {"error": "Não foi possível buscar as submissões"}
