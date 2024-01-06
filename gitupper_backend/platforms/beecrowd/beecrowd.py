from platforms.utils.commons import error_msg
from .auth import BeeAuthenticator
from .submissions import BeeSubmissionsFetcher
from .updater import initialize_bg_fetcher
from gitupper.models import User


def get_options():
    options = {
        "--extract-not-accepted": False,
        "--upload-github": "true",
    }
    return options


def get_bee_submissions(user: User,  gitupper_id: int = None):
    options = get_options()
    access_token = user.beeuser.access_token

    authenticator = BeeAuthenticator(
        None, None, access_token, gitupper_id)

    bee_user = authenticator.authenticate_session()

    if not bee_user:
        # Token is invalid
        return error_msg("Token inválido")

    bee_fetcher = BeeSubmissionsFetcher(bee_user, gitupper_id, options)
    try:
        submissions = bee_fetcher.get_submissions()

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


def retrieve_bee_user(email: str = None, password: str = None, session_id: str = None, gitupper_id: int = None):
    try:
        authenticator = BeeAuthenticator(
            email, password, session_id, gitupper_id)
        if email and password:
            user = authenticator.authenticate()

        else:
            user = authenticator.authenticate_session()
        return user
    except Exception as e:
        print(e)
        return None


stop = initialize_bg_fetcher()
