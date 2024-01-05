from lxml import etree
from platforms.auth import Authenticator
from platforms.auth import PLATFORM_COOKIES
from platforms.hackerrank.selenium_helper import retrieve_hrank_session
from platforms.user import HackerrankUser, create_user
from platforms.utils.requester import Requester
from .config import *


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

    def get_session_cookie(self):
        # A requesição abaixo já seta o cookie de sessão
        self.req.make_request(hackerrank_login_url)

        return self.req.get_cookie_dict()['hackerrank_session_cookie_name']

    def get_bee_info(self, response: str):
        tree = etree.fromstring(response, self.html_parser)

        encoded_email = tree.xpath(
            ".//a[@data-cfemail] ")[0].get('data-cfemail')
        email = self.decode_cf_email(encoded_email)

        profile_link = [elem.get('href') for elem in tree.xpath(".//a")][0]
        profile_value = profile_link.find("profile")

        if profile_value == -1:
            return None

        starting_point = profile_value + len("profile/")
        bee_id = profile_link[starting_point:]

        return email, bee_id

    # def authenticate_user(login: str, password: str, gitupper_id: int = None):
    #     session = HTMLSession()

        

    #     if not _hrank_session:
    #         error = {
    #             "login": "Não foi possível realizar o login",
    #         }
    #         return error

    #     session.cookies.set(domain="www.hackerrank.com",
    #                         name=hackerrank_session_cookie_name, value=_hrank_session)

    #     res_json = response_json_parser(session.get("{}/{}".format(
    #         hackerrank_profile_url, username), headers=base_headers))

    #     user = HackerrankUser(hacker_id=res_json["model"]["id"], name=res_json["model"]["name"],
    #                           email=res_json["model"]["email"], active_session=session)

    #     create_user(user, gitupper_id, access_token=_hrank_session)

    #     return user

    # def authenticate(self):
    #     username, _hrank_session = retrieve_hrank_session(self.login, self.password)
