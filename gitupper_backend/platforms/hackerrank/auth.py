from lxml import etree
from requests_html import HTMLSession
from platforms.auth import Authenticator
from platforms.user import HackerrankUser, create_user
from platforms.utils.commons import response_json_parser
from platforms.utils.requester import Requester
from .selenium_helper import run_helper
from .config import base_headers, hackerrank_login_url, hackerrank_profile_url


class HackerAuthenticator(Authenticator):
    def __init__(self, login: str = None, password: str = None, session_id: str = None, gitupper_id: int = None):
        super().__init__(login, password, session_id, gitupper_id)
        self.__html_parser = etree.HTMLParser()

    @property
    def req(self):
        req: Requester = super().req
        return req

    @property
    def html_parser(self):
        return self.__html_parser

    def authenticate(self, login: str, password: str):
        session = HTMLSession()

        username, _hrank_session = run_helper(login, password)

        if not _hrank_session:
            error = {
                "login": "Não foi possível realizar o login",
            }
            return error

        cookie = self.get_platform_cookie('hacker')
        session.cookies.set(domain=cookie.get('domain'),
                            name=cookie.get('name'), value=_hrank_session)

        res_json = response_json_parser(session.get("{}/{}".format(
            hackerrank_profile_url, username), headers=base_headers))

        user = HackerrankUser(hacker_id=res_json["model"]["id"], name=res_json["model"]["name"],
                              email=res_json["model"]["email"], active_session=session)

        create_user(user, self.gitupper_id, access_token=_hrank_session,
                    token_expires=self.get_session_cokie_expiration(self.get_expiration_cookie_name('hacker')))

        return user

    def authenticate_session(self):
        session = HTMLSession()

        cookie = self.get_platform_cookie('hacker')
        session.cookies.set(domain=cookie.get('domain'), name=cookie.get('name'),
                            value=self.session_id)

        try:
            res_json = response_json_parser(session.get("{}/me".format(
                hackerrank_profile_url), headers=base_headers))

            user = HackerrankUser(hacker_id=res_json["model"]["id"], name=res_json["model"]["name"],
                                  email=res_json["model"]["email"], active_session=session)

        except Exception as e:
            print(e)

            # Token expired
            self.notify_token_expired('hacker')
            return None

        create_user(user, self.gitupper_id, access_token=self.session_id,
                    token_expires=self.get_session_cokie_expiration(self.get_session_cookie_name('hacker')))

        return user
