import time
from requests_html import HTMLSession

from .config import *
from .selenium_helper import run_helper

from platforms.utils.commons import format_submission
from gitupper.models import HackerUser, HackerSubmission
from platforms.utils.commons import *
from platforms.utils.files import *
from platforms.user import HackerrankUser, create_user


def authenticate_session(hacker_session: str, gitupper_id: int = None):
    session = HTMLSession()

    session.cookies.set(domain="www.hackerrank.com",
                        name=hackerrank_session_cookie_name, value=hacker_session)

    res_json = response_json_parser(session.get("{}/me".format(
        hackerrank_profile_url), headers=base_headers))

    user = HackerrankUser(hacker_id=res_json["model"]["id"], name=res_json["model"]["name"],
                          email=res_json["model"]["email"], active_session=session)

    create_user(user, gitupper_id, access_token=hacker_session)

    return user


def authenticate_user(login: str, password: str, gitupper_id: int = None):
    session = HTMLSession()

    username, _hrank_session = run_helper(login, password)

    if not _hrank_session:
        error = {
            "login": "Não foi possível realizar o login",
        }
        return error

    session.cookies.set(domain="www.hackerrank.com",
                        name=hackerrank_session_cookie_name, value=_hrank_session)

    res_json = response_json_parser(session.get("{}/{}".format(
        hackerrank_profile_url, username), headers=base_headers))

    user = HackerrankUser(hacker_id=res_json["model"]["id"], name=res_json["model"]["name"],
                          email=res_json["model"]["email"], active_session=session)

    create_user(user, gitupper_id, access_token=_hrank_session)

    return user


def get_detailed_submission(submission_id: int, session: HTMLSession):

    res_json = response_json_parser(session.get(
        "{}/{}".format(hackerrank_submissions_url, submission_id), headers=base_headers))

    return res_json["model"]


def retrieve_submission(submission, hacker_user: HackerUser, session: HTMLSession):
    detailed_submission = get_detailed_submission(
        submission["id"], session)

    formatted_prog_language = format_prog_language(
        detailed_submission['language'])
    formatted_problem_name = format_problem_name(detailed_submission['name'])

    filename = format_filename(
        detailed_submission["challenge_id"], formatted_problem_name, formatted_prog_language)

    hacker_submission = HackerSubmission(id=detailed_submission['id'], user=hacker_user, problem_name=detailed_submission['name'], challenge_id=detailed_submission["challenge_id"], status=detailed_submission['status'], contest_id=detailed_submission['contest_id'],
                                         prog_language=detailed_submission['language'], category=detailed_submission['kind'], date_submitted=detailed_submission["created_at"], source_code=detailed_submission['code'], display_score=detailed_submission['display_score'], filename=filename)
    hacker_submission.save()

    return hacker_submission


def get_submissions(user: HackerrankUser, options=None, gitupper_id: int = None):
    session = user.active_session
    hacker_user = HackerUser.objects.get(hacker_id=user.hacker_id)

    res_json = response_json_parser(session.get("{}/?limit={}".format(
        hackerrank_submissions_url, SUBMISSIONS_LIMIT), headers=base_headers))

    list_length = len(res_json["models"])

    if list_length > 0:
        submissions = []
        retry_list = []

        for submission in res_json["models"]:
            try:
                detailed_submission = retrieve_submission(
                    submission, hacker_user, session)
                submissions.append(format_submission(
                    detailed_submission, "hacker"))

            except Exception as e:
                print(e)
                retry_list.append(submission)

        if len(retry_list) > 0:
            time.sleep(35)

        # with concurrent.futures.ThreadPoolExecutor() as executor:
        #     responses = {executor.submit(retrieve_submission, res_json["models"]
        #                                  [number], hacker_user, session): res_json["models"]
        #                  [number] for number in range(list_length)}

        #     for response in concurrent.futures.as_completed(responses):
        #         submission = responses[response]

        #         try:
        #             hacker_submission = response.result()
        #             submissions.append(format_submission(
        #                 hacker_submission, "hackerrank"))
        #         except Exception as e:
        #             retry_list.append(submission)

        while len(retry_list) > 0:
            submission = retry_list.pop(0)

            try:
                detailed_submission = retrieve_submission(
                    submission, hacker_user, session)
                submissions.append(format_submission(
                    detailed_submission, "hacker"))
            except Exception as e:
                retry_list.append(submission)
        return submissions

    return res_json["models"]
