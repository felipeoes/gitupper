from .submissions import authenticate_user, get_submissions, authenticate_session
from platforms.user import HackerrankUser


def get_hacker_submissions(user: HackerrankUser,  gitupper_id: int = None, options: dict = None):
    access_token = user.hackeruser.access_token

    hacker_user = authenticate_session(access_token, gitupper_id)
    try:
        submissions = get_submissions(
            hacker_user, options, gitupper_id)
        user.hacker_submissions = submissions
        return user
    except Exception as e:
        print(e)
        return None


def retrieve_hacker_user(login: str = None, password: str = None, hacker_session: str = None, gitupper_id: int = None):
    try:
        if login and password:
            user = authenticate_user(login, password, gitupper_id)
        else:
            user = authenticate_session(hacker_session, gitupper_id)
        return user
    except Exception as e:
        print(e)
        return None
