from platforms.auth import Requester
from gitupper.models import User as GitupperUser, BeeUser, HackerUser, LeetUser


class BaseUser():
    def __init__(self, email: str = None, name: str = None, active_session: Requester = None):
        self.__email = email
        self.__name = name
        self.__active_session = active_session

    @property
    def email(self):
        return self.__email

    @property
    def name(self):
        return self.__name

    @property
    def active_session(self):
        return self.__active_session


class BeecrowdUser(BaseUser):
    def __init__(self, bee_id: str, email: str = None, name: str = None, active_session: Requester = None, bee_submissions=None):
        super().__init__(email, name, active_session)
        self.__bee_id = bee_id
        self.__bee_submissions = bee_submissions

    @property
    def bee_id(self):
        return self.__bee_id

    @property
    def bee_submissions(self):
        return self.__bee_submissions

    @bee_submissions.setter
    def bee_submissions(self, value):
        self.__bee_submissions = value


class HackerrankUser(BaseUser):
    def __init__(self, hacker_id: str, email: str = None, name: str = None, active_session: Requester = None, hacker_submissions=None):
        super().__init__(email, name, active_session)
        self.__hacker_id = hacker_id
        self.__hacker_submissions = hacker_submissions

    @property
    def hacker_id(self):
        return self.__hacker_id

    @property
    def hacker_submissions(self):
        return self.__hacker_submissions

    @hacker_submissions.setter
    def hacker_submissions(self, value):
        self.__hacker_submissions = value


class LeetcodeUser(BaseUser):
    def __init__(self, leet_id: str, email: str = None, name: str = None, active_session: Requester = None, leet_submissions=None):
        super().__init__(email, name, active_session)
        self.__leet_id = leet_id
        self.__leet_submissions = leet_submissions

    @property
    def leet_id(self):
        return self.__leet_id

    @property
    def leet_submissions(self):
        return self.__leet_submissions

    @leet_submissions.setter
    def leet_submissions(self, value):
        self.__leet_submissions = value


current_user_types = {
    BeecrowdUser: ["bee", BeeUser],
    HackerrankUser: ["hacker", HackerUser],
    LeetcodeUser: ["leet", LeetUser]
}


def create_user(user: object, gitupper_id: int, access_token: str = None):
    for instance, value in current_user_types.items():
        if isinstance(user, instance):
            platform_prefix, platform_model = value
            try:
                platform_id = getattr(user, f"{platform_prefix}_id")
                platform_field = {f"{platform_prefix}_id": platform_id}

                user = instance.objects.get(platform_field)
            except:
                gitupper_user = GitupperUser.objects.get(
                    gitupper_id=gitupper_id)
                user = platform_model(gitupper_user=gitupper_user, **platform_field, first_name=gitupper_user.first_name or user.name,
                                      last_name=gitupper_user.last_name or "", email=user.email, access_token=access_token)
                setattr(gitupper_user, f"{platform_prefix}_id", platform_id)

                user.save()
                gitupper_user.save()

            break
