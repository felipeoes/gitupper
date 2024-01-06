from gitupper.models import User
from .submissions import LeetSubmissionsFetcher
from .auth import LeetAuthenticator
from platforms.utils.commons import error_msg


def get_leet_submissions(user: User,  gitupper_id: int = None, options: dict = None):
    access_token = user.leetuser.access_token

    auth = LeetAuthenticator(
        None, None, access_token, gitupper_id)

    leet_user = auth.authenticate_session()

    if not leet_user:
        return error_msg("Token inválido")

    fetcher = LeetSubmissionsFetcher(leet_user, gitupper_id, options)
    try:
        submissions = fetcher.get_submissions()

        if isinstance(submissions, dict):
            error = submissions.get("error")
            if error:
                return error_msg(error)

            already_updated = submissions.get("already_updated")

            if already_updated:
                return {"already_updated": already_updated}

        return submissions
    except Exception as e:
        print(e)
        return None

    # leet_user = authenticate_session(access_token, gitupper_id)
    # try:
    #     submissions = get_submissions(
    #         leet_user, options, gitupper_id)
    #     user.leet_submissions = submissions
    #     return user
    # except Exception as e:
    #     print(e)
    #     return None


def retrieve_leet_user(login: str = None, password: str = None, leet_session: str = None, gitupper_id: int = None):
    try:
        auth = LeetAuthenticator(
            login, password, leet_session, gitupper_id)

        if login and password:
            user = auth.authenticate(login, password)
        else:
            user = auth.authenticate_session()
        return user
    except Exception as e:
        print(e)
        return None
    # try:
    #     if login and password:
    #         user = authenticate_user(login, password, gitupper_id)
    #     else:
    #         user = authenticate_session(leet_session, gitupper_id)
    #     return user
    # except Exception as e:
    #     print(e)
    #     return None
