from gitupper.models import User
from platforms.utils.commons import error_msg
from .submissions import HackerSubmissionsFetcher
from .auth import HackerAuthenticator


def get_hacker_submissions(user: User,  gitupper_id: int = None, options: dict = None):
    access_token = user.hackeruser.access_token

    auth = HackerAuthenticator(
        None, None, access_token, gitupper_id)

    hacker_user = auth.authenticate_session()

    if not hacker_user:
        return error_msg("Token inválido")

    fetcher = HackerSubmissionsFetcher(hacker_user, gitupper_id, options)
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


def retrieve_hacker_user(login: str = None, password: str = None, hacker_session: str = None, gitupper_id: int = None):
    try:
        auth = HackerAuthenticator(
            login, password, hacker_session, gitupper_id)

        if login and password:
            user = auth.authenticate(login, password)
        else:
            user = auth.authenticate_session()
        return user
    except Exception as e:
        print(e)
        return None
