SUBMISSIONS_LIMIT = 1000

leetcode_base_url = "https://www.leetcode.com"
leetcode_login_url = f"{leetcode_base_url}/accounts/login/?next=/profile/account/"
leetcode_profile_url = f"{leetcode_base_url}/profile"
leetcode_graphql_url = f"{leetcode_base_url}/graphql"
leetcode_submissions_url = f"{leetcode_base_url}/api/submissions"

leetcode_domain = ".leetcode.com"
leetcode_session_cookie_name = "LEETCODE_SESSION"


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

login_post_headers = {
    "authority": "leetcode.com",
    "method": "POST",
    "path": "/accounts/login/",
    "scheme": "https",
    "accept": "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryzODDXJBQlm4uvhkv",
    "origin": "https://leetcode.com",
    "referer": "https://leetcode.com/accounts/login/",
    "sec-ch-ua": "'Not;A Brand';v='99', 'Google Chrome';v='97', 'Chromium';v='97'",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "Windows",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36",
}