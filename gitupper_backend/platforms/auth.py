
from platforms.utils.requester import Requester


class Authenticator:
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


PLATFORM_COOKIES = {
    'bee': {
        'name': 'judge',
        'domain': 'www.beecrowd.com.br',
        'path': '/judge/',
        'secure': True
    }
}
