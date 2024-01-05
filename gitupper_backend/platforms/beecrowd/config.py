from fake_useragent import UserAgent

beecrowd_base_url = "https://www.beecrowd.com.br"
beecrowd_login_url = "{}/judge/pt/login".format(beecrowd_base_url)
beecrowd_dashboard_url = "{}/judge/pt/".format(beecrowd_base_url)
beecrowd_submissions_url = "{}/judge/pt/runs".format(beecrowd_base_url)
beecrowd_all_problems_url = "{}/judge/pt/problems/all/view".format(
    beecrowd_base_url)
beecrowd_domain = "www.beecrowd.com.br"
session_cookie_name = "judge"


ua = UserAgent()

base_headers = {
    # "sec-ch-ua": "' .Not/A)Brand';v='99', 'Google Chrome';v='103', 'Chromium';v='103'",
    # "sec-ch-ua-mobile": "?0",
    # "sec-ch-ua-platform": "Windows",
    # "sec-fetch-dest": "document",
    # "sec-fetch-mode": "navigate",
    # "sec-fetch-site": "none",
    # "sec-fetch-user": "?1",
    # "upgrade-insecure-requests": "1",
    # "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
    "user-agent": str(ua.random),
}

login_post_headers = {
    ":authority": "www.beecrowd.com.br",
    ":method": "POST",
    ":path": "/judge/pt/login",
    ":scheme": "https",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "pt-BR,pt;q=0.9",
    "cache-control": "max-age=0",
    "content-length": "296",
    "content-type": "application/x-www-form-urlencoded",
    "origin": "https://www.beecrowd.com.br",
    "referer": "https://www.beecrowd.com.br/judge/pt/login",
    "sec-ch-ua": " 'Not;A Brand';v='99', 'Google Chrome';v='97', 'Chromium';v='97'",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
}
