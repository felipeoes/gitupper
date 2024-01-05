import time
import http.cookiejar
from urllib.request import urlopen, Request, install_opener, build_opener, HTTPCookieProcessor
from urllib.parse import urlencode
from urllib.error import HTTPError, URLError


class Requester:
    """ Class used to manipulate requests and session cookies"""

    def __init__(self, data=None, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"}, cookies=None, timeout=90, proxy=None):
        self.data = data
        self.headers = headers
        self.cookies = cookies
        self.timeout = timeout
        self.proxy = proxy
        self.response = None
        self.html = None
        self.text = None
        self.status_code = None
        self.error = None
        self.cookie_jar = http.cookiejar.CookieJar().set_cookie(
            cookies) if cookies else http.cookiejar.CookieJar()
        self.opener = build_opener(HTTPCookieProcessor(self.cookie_jar))
        # self.retries = retries

        install_opener(self.opener)

    def make_request(self, url, data=None, headers=None):
        if data is not None:
            # Processa os dados para serem enviados na requisição
            data = urlencode(data)
            data = data.encode("utf-8")

        headers = headers if headers else self.headers
        request = Request(url, data, headers)

        while True:
            try:
                with urlopen(request, timeout=self.timeout) as response:
                    self.html = response.read()
                    self.text = self.html.decode('utf-8')
                    self.status_code = response.getcode()
                    return self.text
            except HTTPError as error:
                print(error.status, error.reason)
            except URLError as error:
                print(error.reason)
            except TimeoutError:
                print("Request timed out")

            time.sleep(30)
            continue

    def get_cookie(self):
        return self.cookie_jar._cookies

    def set_cookie(self, cookie):
        self.cookie_jar.set_cookie(cookie)

    def cookie_dict_to_cookie(self, cookie_obj):
        return http.cookiejar.Cookie(version=0, name=cookie_obj.get('name'), value=cookie_obj.get('value'), port=None, port_specified=False, domain=cookie_obj.get('domain'), domain_specified=False, domain_initial_dot=False, path=cookie_obj.get('path'), path_specified=True, secure=cookie_obj.get('secure'), expires=None, discard=True, comment=None, comment_url=None, rest={'HttpOnly': None}, rfc2109=False)

    def get_cookie_string(self):
        return self.cookie_jar.get_cookie_header(self.url)

    def get_cookie_dict(self):
        return dict([(cookie.name, cookie.value) for cookie in self.cookie_jar])

    def get_cookie_jar(self):
        return self.cookie_jar
