from lxml import etree
from platforms.auth import PLATFORM_COOKIES
from platforms.user import BeecrowdUser, create_user
from platforms.utils.requester import Requester
from platforms.auth import Authenticator
from .config import *


class BeeAuthenticator(Authenticator):
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

    def get_tokens(self):
        response = self.req.make_request(beecrowd_login_url)

        tree = etree.fromstring(response, self.__html_parser)

        token_fields = tree.findall(
            ".//input[@name='_Token[fields]']")[-1].get('value')
        csrfToken = tree.findall(
            ".//input[@name='_csrfToken']")[-1].get('value')

        return token_fields, csrfToken

    def decode_cf_email(self, encoded_email: str):
        r = int(encoded_email[:2], 16)
        email = ''.join([chr(int(encoded_email[i:i+2], 16) ^ r)
                        for i in range(2, len(encoded_email), 2)])
        return email

    def get_bee_info(self, response: str):
        tree = etree.fromstring(response, self.html_parser)

        encoded_email = tree.xpath(
            ".//a[@data-cfemail] ")[0].get('data-cfemail')
        email = self.decode_cf_email(encoded_email)

        profile_link = [elem.get('href') for elem in tree.xpath(".//a")][0]
        profile_value = profile_link.find("profile")
        starting_point = profile_value + len("profile/")

        if profile_value == -1:
            return None

        starting_point = profile_value + len("profile/")
        bee_id = profile_link[starting_point:]

        return email, bee_id

    def get_url_content(self, url: str):
        response = self.req.make_request(url)

        return response

    def authenticate_user(self, email: str, bee_id: int, access_token: str):

        user = BeecrowdUser(bee_id, email, active_session=self.req)

        create_user(user, self.gitupper_id, access_token=access_token,
                    token_expires=self.get_session_cokie_expiration(
                        self.get_expiration_cookie_name('bee')))

        return user

    def authenticate(self):
        token_fields, csrfToken = self.get_tokens()

        body = {
            "_method": "POST",
            "_csrfToken": "{csrfToken}".format(csrfToken=csrfToken),
            "email": "{email}".format(email=self.login),
            "password": "{password}".format(password=self.password),
            "remember_me": "1",
            "_Token[fields]:": "{token_fields}".format(token_fields=token_fields),
            "_Token[unlocked]:": "",
        }

        response = self.req.make_request(
            "https://www.beecrowd.com.br/judge/pt/login", data=body)

        if response is not None and self.req.status_code == 200:
            access_token = self.get_session_cookie(
                self.get_session_cookie_name('bee'))
            email, bee_id = self.get_bee_info(response)

            user = self.authenticate_user(
                email, bee_id, access_token)
            return user

        return None

    def authenticate_session(self):
        cookie = self.get_platform_cookie('bee')
        cookie.update({'value': self.session_id})
        cookie = self.req.cookie_dict_to_cookie(cookie)
        self.req.set_cookie(cookie)

        response = self.get_url_content(beecrowd_dashboard_url)

        try:
            email, bee_id = self.get_bee_info(response)
        except:
            # Token expired
            self.notify_token_expired('bee')
            return None

        user = self.authenticate_user(
            email, bee_id, self.session_id)
        return user
