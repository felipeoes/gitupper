import concurrent.futures
from requests_html import HTMLSession
from datetime import datetime

from .config import *

from .selenium_helper import run_helper
from platforms.submissions_saver import save_submissions
from platforms.utils.commons import format_submission
from gitupper.models import LeetUser, LeetSubmission
from platforms.utils.commons import *
from platforms.utils.files import *
from platforms.user import LeetcodeUser, create_user


def authenticate_session(leet_session: str, gitupper_id: int = None):
    session = HTMLSession()

    session.cookies.set(domain=leetcode_domain,
                        name=leetcode_session_cookie_name, value=leet_session)

    email_query_params = "operationName=user&query=query%20user%20{%20%20user%20{%20%20%20%20socialAccounts%20%20%20%20username%20%20%20%20emails%20{%20%20%20%20%20%20email%20%20%20%20%20%20primary%20%20%20%20%20%20verified%20%20%20%20%20%20__typename%20%20%20%20}%20%20%20%20phone%20%20%20%20profile%20{%20%20%20%20%20%20rewardStats%20%20%20%20%20%20__typename%20%20%20%20}%20%20%20%20__typename%20%20}}"

    name_query_params = "operationName=userRealName&query=query%20userRealName%20{%20%20user%20{%20%20%20%20profile%20{%20%20%20%20%20%20realName%20%20%20%20%20%20__typename%20%20%20%20}%20%20%20%20__typename%20%20}}"

    res_json = response_json_parser(session.get(
        f"{leetcode_graphql_url}/?{email_query_params}"))
    username = res_json["data"]["user"]["username"]
    email = res_json["data"]["user"]["emails"][0]["email"]

    res_json = response_json_parser(session.get(
        f"{leetcode_graphql_url}/?{name_query_params}"))
    name = res_json["data"]["user"]["profile"]["realName"]

    user = LeetcodeUser(leet_id=username, name=name,
                        email=email, active_session=session)

    create_user(user, gitupper_id, access_token=leet_session)

    return user


def authenticate_user(login: str, password: str, gitupper_id: int = None):
    session = HTMLSession()

    name, username, email, LEETCODE_SESSION = run_helper(
        login, password)

    if not LEETCODE_SESSION:
        error = {
            "login": "Não foi possível realizar o login",
        }

        return error

    session.cookies.set(domain=leetcode_domain,
                        name=leetcode_session_cookie_name, value=LEETCODE_SESSION)

    user = LeetcodeUser(leet_id=username, name=name,
                        email=email, active_session=session)

    create_user(user, gitupper_id, access_token=LEETCODE_SESSION)

    return user


def get_detailed_submission(submission, session: HTMLSession):
    title_slug = submission["title_slug"]

    category_query_params = "operationName=questionData&variables={%22titleSlug%22:%22" + title_slug + \
        "%22}&query=query%20questionData($titleSlug:%20String!)%20{%20%20question(titleSlug:%20$titleSlug)%20{%20%20%20%20questionId%20%20%20%20categoryTitle%20%20__typename%20%20}}"

    res_json = response_json_parser(session.get(
        f"{leetcode_graphql_url}/?{category_query_params}"))

    submission["problem_number"] = res_json["data"]["question"]["questionId"]
    submission["category"] = res_json["data"]["question"]["categoryTitle"]
    return submission


def retrieve_submission(submission, leet_user: LeetUser, session: HTMLSession):
    detailed_submission = get_detailed_submission(
        submission, session)

    formatted_prog_language = format_prog_language(
        detailed_submission['lang'])
    formatted_problem_name = format_problem_name(detailed_submission['title'])

    filename = format_filename(
        detailed_submission["problem_number"], formatted_problem_name, formatted_prog_language)
    date_submitted = datetime.fromtimestamp(detailed_submission["timestamp"])
    leet_submission = LeetSubmission(id=detailed_submission['id'], user=leet_user, problem_name=detailed_submission['title'], problem_number=detailed_submission["problem_number"], status=detailed_submission['status_display'],
                                     prog_language=detailed_submission['lang'], category=detailed_submission['category'], date_submitted=date_submitted, source_code=detailed_submission['code'], filename=filename)
    leet_submission.save()

    return leet_submission


submissions = []


def get_submissions(user: LeetcodeUser, options=None, gitupper_id: int = None):
    global submissions
    session = user.active_session
    leet_user = LeetUser.objects.get(leet_id=user.leet_id)

    res_json = response_json_parser(session.get(
        f"{leetcode_submissions_url}/?offset=0&limit={SUBMISSIONS_LIMIT}&lastkey=", headers=base_headers))

    submissions_list = res_json["submissions_dump"]
    list_length = len(submissions_list)

    if list_length > 0:

        retry_list = []

        with concurrent.futures.ThreadPoolExecutor() as executor:
            responses = {executor.submit(
                retrieve_submission, submission, leet_user, session): submission for submission in submissions_list}

            for response in concurrent.futures.as_completed(responses):
                leet_submission = response.result()
                submissions.append(format_submission(leet_submission, "leet"))

        save_submissions(submissions, "leet", leet_user)
        return submissions

    return res_json["submissions_dump"]
