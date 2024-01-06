import json
import requests
from requests_html import HTMLSession
from platforms.auth import Authenticator
from platforms.user import LeetcodeUser, create_user
from platforms.utils.commons import response_json_parser
from platforms.utils.requester import Requester
from .selenium_helper import run_helper
from .config import leetcode_graphql_url


class LeetAuthenticator(Authenticator):
    def __init__(self, login: str = None, password: str = None, session_id: str = None, gitupper_id: int = None):
        super().__init__(login, password, session_id, gitupper_id)

    @property
    def req(self):
        req: Requester = super().req
        return req

    def query_graphql(self, operation_name: str, query: str, session: HTMLSession):
        url = "https://leetcode.com/graphql/"
        data = {'operationName': operation_name,
                'query': query,
                'variables': {}
                }
        json_data = json.dumps(data)
        headers = {
            'Content-Type': 'application/json',
            'Cookie': self.cookies_to_string(session.cookies)
        }

        # Need to use requests instead of session because of the leetcode graphql endpoint
        response = requests.request(
            "POST", url, headers=headers, data=json_data)

        # response = session.post(leetcode_graphql_url, json=json_data)

        return response_json_parser(response)

    def authenticate(self, login: str, password: str):
        session = HTMLSession()

        name, username, email, LEETCODE_SESSION = run_helper(login, password)

        if not LEETCODE_SESSION:
            error = {
                "login": "Não foi possível realizar o login",
            }

            return error

        cookie = self.get_platform_cookie('leet')
        session.cookies.set(domain=cookie.get('domain'),
                            name=cookie.get('name'), value=LEETCODE_SESSION)

        user = LeetcodeUser(leet_id=username, name=name,
                            email=email, active_session=session)

        create_user(user, self.gitupper_id, access_token=LEETCODE_SESSION,
                    token_expires=self.get_session_cokie_expiration(self.get_expiration_cookie_name('leet')))

        return user

    def authenticate_session(self):
        session = HTMLSession()

        cookie = self.get_platform_cookie('leet')
        session.cookies.set(domain=cookie.get('domain'), name=cookie.get('name'),
                            value=self.session_id)

        try:
            # get user info
            operation_name = 'user'
            query = '''query user {\n  user {\n    socialAccounts\n    username\n    emails {\n      email\n      primary\n      verified\n      __typename\n    }\n    phone\n    profile {\n realName\n      rewardStats\n      __typename\n    }\n    __typename\n  }\n}\n'''

            res_json = self.query_graphql(operation_name, query, session)

            username = res_json["data"]["user"]["username"]
            email = res_json["data"]["user"]["emails"][0]["email"]
            name = res_json["data"]["user"]["profile"]["realName"]

            user = LeetcodeUser(leet_id=username, name=name,
                                email=email, active_session=session)
            create_user(user, self.gitupper_id, access_token=self.session_id,
                        token_expires=self.get_session_cokie_expiration(self.get_session_cookie_name('leet')))

            return user
        except Exception as e:
            print(e)

            # Token expired
            self.notify_token_expired('leet')
            return None
