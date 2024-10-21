import time
from requests_html import HTMLSession
from platforms.base_submissions_fetcher import BaseSubmissionsFetcher
from platforms.utils.commons import format_submission
from gitupper.models import HackerUser, HackerSubmission, TemporaryProgress
from platforms.submissions_saver import save_submissions, check_submissions_offset, format_datetime
from platforms.utils.commons import *
from platforms.utils.files import *
from platforms.user import HackerrankUser

from .config import *
from datetime import datetime

from .auth import Authenticator


# Since this class implements BaseSubmissionsFetcher, it will need to implement fetch_submissions method.
# BaseSubmissionsFetcher has a get_submissions method that will call fetch_submissions and return the result.

class HackerSubmissionsFetcher(BaseSubmissionsFetcher):
    def __init__(self, user: HackerrankUser, gitupper_id: str, authenticator: Authenticator, options: dict = {}):
        super().__init__(user, gitupper_id, authenticator, options)
        self.__session: HTMLSession = user.active_session
        self.fetch_until = SUBMISSIONS_LIMIT
        self.total_submissions = 0
        self.progress = 0

    @property
    def session(self):
        return self.__session

    def get_detailed_submission(self, submission_id: int):
        res_json = response_json_parser(self.session.get(
            "{}/{}".format(hackerrank_submissions_url, submission_id), headers=base_headers))

        return res_json["model"]

    def retrieve_submission(self, submission, hacker_user, temp_progress):
        detailed_submission = self.get_detailed_submission(
            submission["id"])

        formatted_prog_language = format_prog_language(
            detailed_submission['language'])
        formatted_problem_name = format_problem_name(
            detailed_submission['name'])

        filename = format_filename(
            detailed_submission["challenge_id"], formatted_problem_name, formatted_prog_language)

        hacker_submission = HackerSubmission(id=detailed_submission['id'], user=hacker_user, problem_name=detailed_submission['name'], challenge_id=detailed_submission["challenge_id"], status=detailed_submission['status'], contest_id=detailed_submission['contest_id'],
                                             prog_language=detailed_submission['language'], category=detailed_submission['kind'], date_submitted=detailed_submission["created_at"], source_code=detailed_submission['code'], display_score=detailed_submission['display_score'], filename=filename)

        self.progress += round(1 / self.total_submissions * 100, 2)
        print(f"Progress: {self.progress}%")
        temp_progress.value = self.progress
        temp_progress.save()

        return hacker_submission

    def get_starting_offset_from_submission(self, last_submission_datetime: datetime):
        # Get the offset from the submission datetime
        res_json = response_json_parser(self.session.get(
            f"{hackerrank_submissions_url}?offset=0&limit={SUBMISSIONS_LIMIT}", headers=base_headers))

        # submissions are fetched in descending order of datetime, so the newer submissions have offset 0.
        list_length = len(res_json["models"])

        if list_length > 0:
            for index, submission in enumerate(res_json["models"]):
                if format_datetime(submission["created_at"]) > last_submission_datetime:
                    inner_index = index
                    # Newer submission found. Check if the next submission is also newer than the last submission
                    while inner_index + 1 < list_length and format_datetime(res_json["models"][inner_index + 1]["created_at"]) > last_submission_datetime:
                        self.fetch_until += 1
                        inner_index += 1
                        continue
                    else:
                        # if it isn't, then return the offset
                        self.fetch_until += 1
                        return self.fetch_until

        # If it reaches this point, it means that there are no newer submissions
        return None

    def check_is_up_to_date(self, offset):
        # if offset is none then it means that there are no new submissions
        return offset is None

    def fetch_submissions(self):
        # Check if should fetch from offset
        last_submission_id, last_submission_datetime = check_submissions_offset(
            self.gitupper_id, 'hacker')

        if last_submission_datetime is not None:
            fetch_until = self.get_starting_offset_from_submission(
                last_submission_datetime)

            if fetch_until is not None:
                self.fetch_until = fetch_until

            if self.check_is_up_to_date(fetch_until):
                return {"already_updated": True}

        try:

            res_json = response_json_parser(self.session.get(
                f"{hackerrank_submissions_url}?offset=0&limit={self.fetch_until}", headers=base_headers))

            list_length = len(res_json["models"])

            if list_length > 0:
                submissions = []
                retry_list = []

                hacker_user = HackerUser.objects.get(
                    hacker_id=self.user.hacker_id)

                self.total_submissions = self.total_submissions if self.total_submissions > 0 else list_length

                # Start progress, so frontend can track it
                temp_progress = TemporaryProgress(
                    value=self.progress, gitupper_id=self.gitupper_id)
                temp_progress.save()

                for submission in res_json["models"]:
                    try:
                        detailed_submission = self.retrieve_submission(
                            submission, hacker_user, temp_progress)
                        submissions.append(format_submission(
                            detailed_submission, "hacker"))

                    except Exception as e:
                        print(e)
                        retry_list.append(submission)

                if len(retry_list) > 0:
                    time.sleep(35)

                while len(retry_list) > 0:
                    submission = retry_list.pop(0)

                    try:
                        detailed_submission = self.retrieve_submission(
                            submission, hacker_user, temp_progress)
                        submissions.append(format_submission(
                            detailed_submission, "hacker"))
                    except Exception as e:
                        retry_list.append(submission)

                # save submissions
                save_submissions(submissions, 'hacker', hacker_user)

                temp_progress.value = 100
                temp_progress.save()

                return submissions

            return res_json["models"]
        except Exception as e:
            print(e)
            return {"error": "Ocorreu um erro ao tentar buscar suas submissões."}
