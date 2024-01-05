
import json
import gzip

from requests_html import HTMLSession

SUBMISSIONS_LIMIT = 1000

hackerrank_base_url = "https://www.hackerrank.com"
hackerrank_dashboard_url = "{}/dashboard".format(hackerrank_base_url)
hackerrank_login_url = "{}/rest/auth/login".format(hackerrank_base_url)
hackerrank_selenium_login_url = "{}/auth/login".format(hackerrank_base_url)
hackerrank_profile_url = "{}/rest/contests/master/hackers".format(
    hackerrank_base_url)
hackerrank_submissions_url = "{}/rest/contests/master/submissions".format(
    hackerrank_base_url)
hackerrank_userdata_url = "{}/rest/data_archives/download".format(
    hackerrank_base_url)
hackerrank_session_cookie_name = "_hrank_session"

base_headers = {
    "sec-ch-ua": "' Not;A Brand';v='99', 'Google Chrome';v='97', 'Chromium';v='97'",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
}


def check_for_data_archive(session: HTMLSession):
    response = session.get(hackerrank_userdata_url)

    if response.status_code == 200:
        res_json = json.loads(response.text)

        if res_json["code"] == "success":  # there is a data archive already
            return True, res_json["data_archive"]["url"]
    return False, None


def read_data_file(encoded_content):
    open('data.gz', 'wb').write(encoded_content)

    with gzip.open('data.gz', 'rb') as f:
        file_content = f.read()
        return json.loads(file_content)


def get_submissions_from_data_file(data_file_url, session):
    response_file = session.get(data_file_url)

    if response_file.status_code == 200:
        data = read_data_file(response_file.content)
    else:
        return None

    return data["submissions"]
