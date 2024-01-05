import time
from platforms.selenium_helper import SeleniumHelper
from .config import leetcode_login_url
from selenium.webdriver import Chrome


def retrieve_leetcode_session(driver: Chrome, login, password):
    driver.get(leetcode_login_url)

    time.sleep(3)

    input_email = driver.find_element('xpath',
                                      "/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/form/span[1]/input")
    input_pass = driver.find_element('xpath',
                                     "/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/form/span[2]/input")
    btn_login = driver.find_element('xpath',
                                    "/html/body/div[1]/div/div[2]/div/div[2]/div/div/div/button")

    input_email.send_keys(login)
    input_pass.send_keys(password)
    btn_login.click()

    time.sleep(5)

    try:
        signed_in = driver.page_source.find("isSignedIn: true")

        if signed_in:
            name = driver.find_element(
                'xpath', "/html/body/div[2]/div/div/div/div[1]/div[2]/div[2]/div[1]/div[2]/span").text
            username = driver.find_element('xpath',
                                           "/html/body/div[2]/div/div/div/div[2]/div[2]/div/div[2]/div[2]/div[1]/div/div/div[2]").text
            email = driver.find_element('xpath',
                                        "/html/body/div[2]/div/div/div/div[2]/div[2]/div/div[2]/div[2]/div[2]/div/div/div[2]/div/div").text.split(" ")[0]

            LEETCODE_SESSION = driver.get_cookie('LEETCODE_SESSION')["value"]

            driver.close()
            return name, username, email, LEETCODE_SESSION
    except Exception as e:
        print(e)
        driver.close()

        return None


def run_helper(login, password):
    helper = SeleniumHelper(retrieve_leetcode_session)
    return helper.run(login, password)
