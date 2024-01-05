from platforms.user import BeecrowdUser
from .auth import BeecrowdAuthenticator
from .submissions import BeecrowdSubmissionsFetcher
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

    authenticator = BeecrowdAuthenticator(
        None, None, access_token, gitupper_id)

    bee_user = authenticator.authenticate_session()
    bee_fetcher = BeecrowdSubmissionsFetcher(bee_user, options, gitupper_id)
    try:
        submissions = bee_fetcher.get_submissions()
        user.bee_submissions = submissions
        return user
    except Exception as e:
        print(e)
        return None


def update_bee_submissions(user: BeecrowdUser, gitupper_id: int = None):
    try:
        user = get_bee_submissions(user, gitupper_id)
        return user
    except Exception as e:
        print(e)
        return None


def retrieve_bee_user(email: str = None, password: str = None, session_id: str = None, gitupper_id: int = None):
    try:
        authenticator = BeecrowdAuthenticator(
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
