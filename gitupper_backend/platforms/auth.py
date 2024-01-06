
from abc import ABC, abstractclassmethod
from platforms.utils.requester import Requester
from datetime import datetime
from gitupper.models import BeeUser, HackerUser, LeetUser

PLATFORM_COOKIES = {
    'bee': {
        'name': 'judge',
        'domain': 'www.beecrowd.com.br',
        'path': '/judge/',
        'secure': True,
        'expiration_cookie': 'RememberMe'
    },
    'hacker': {
        'name': '_hrank_session',
        'domain': 'www.hackerrank.com',
        'path': '/',
        'secure': True,
        'expiration_cookie': ''
    },
    'leet': {
        'name': 'LEETCODE_SESSION',
        'domain': '.leetcode.com',
        'path': '/',
        'secure': True,
        'expiration_cookie': ''
    }
}


class Authenticator(ABC):
    def __init__(self, login: str = None, password: str = None, session_id: str = None, gitupper_id: int = None):
        self.__login = login
        self.__password = password
        self.__session_id = session_id
        self.__gitupper_id = gitupper_id
        self.__req = Requester()

    @property
    def login(self):
        return self.__login

    @property
    def password(self):
        return self.__password

    @property
    def session_id(self):
        return self.__session_id

    @property
    def gitupper_id(self):
        return self.__gitupper_id

    @property
    def req(self):
        return self.__req

    def get_platform_cookie(self, platform_prefix: str):
        return PLATFORM_COOKIES[platform_prefix]

    def get_session_cookie_name(self, platform_prefix: str):
        return PLATFORM_COOKIES[platform_prefix]['name']

    def get_expiration_cookie_name(self, platform_prefix: str):
        return PLATFORM_COOKIES[platform_prefix]['expiration_cookie']

    def format_token_expiration(self, token_expiration: int):
        # token_expiration will be in timestamp format. Convert it to datetime
        try:
            return datetime.fromtimestamp(token_expiration)
        except Exception as e:
            print(e)
            return None

    def get_session_cookie(self, cookie_name: str):
        return self.req.get_cookie_dict()[cookie_name]['value']

    def cookies_to_string(self, cookies: dict):
        """ Transform a dict of cookies to a string. Result will be like:
        'cookie1=value; cookie2=value; cookie3=value;'"""
        cookie_string = ''
        for cookie in cookies:
            cookie_string += f'{cookie.name}={cookie.value};'
        return cookie_string
    def get_session_cokie_expiration(self, cookie_name: str):
        cookies = self.req.get_cookie_dict()

        if cookie_name in cookies:
            return self.format_token_expiration(cookies[cookie_name]['expires'])

        # return next 24h as expiration
        return self.format_token_expiration(datetime.now().timestamp() + 86400)

    def notify_token_expired(self, platform_prefix: str):
        try:
            user = eval(f'{platform_prefix.capitalize()}User').objects.get(
                access_token=self.session_id)
            user.token_expires = None
            user.save()
        except Exception as e:
            print(e)

    @abstractclassmethod
    def authenticate(self):
        pass

    @abstractclassmethod
    def authenticate_session(self):
        pass
