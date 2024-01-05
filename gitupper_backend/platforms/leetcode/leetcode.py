from .submissions import authenticate_user, authenticate_session, get_submissions
from platforms.user import LeetcodeUser


def get_leet_submissions(user: LeetcodeUser,  gitupper_id: int = None, options: dict = None):
    access_token = user.leetuser.access_token
    
    leet_user = authenticate_session(access_token, gitupper_id)
    try:
        submissions = get_submissions(
            leet_user, options, gitupper_id)
        user.leet_submissions = submissions
        return user
    except Exception as e:
        print(e)
        return None


def retrieve_leet_user(login: str = None, password: str = None, leet_session: str = None, gitupper_id: int = None):
    try:
        if login and password:
            user = authenticate_user(login, password, gitupper_id)
        else:
            user = authenticate_session(leet_session, gitupper_id)
        return user
    except Exception as e:
        print(e)
        return None
