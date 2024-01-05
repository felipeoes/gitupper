import time
from bs4 import BeautifulSoup
from platforms.selenium_helper import SeleniumHelper

from selenium.webdriver import Chrome
from .config import hackerrank_selenium_login_url


def check_login_failed(soup: BeautifulSoup):
    return soup.find("div", {"class": "form-alert message-error"}) is not None


def find_username_from_soup(soup: BeautifulSoup):
    user_div = soup.find("div", {"data-analytics": "NavBarProfileDropDown"})
    if user_div is None:
        return None
    return user_div.find("span", {"class": "username text-ellipsis"}).text


def retrieve_hrank_session(driver: Chrome, login, password):
    driver.get(hackerrank_selenium_login_url)

    input_email = driver.find_element('xpath',
                                      "/html/body/div[4]/div/div/div/div[2]/div[2]/div/div/div[2]/div/div/div[2]/div[1]/form/div[1]/div/div/div/input")
    input_pass = driver.find_element('xpath',
                                     "/html/body/div[4]/div/div/div/div[2]/div[2]/div/div/div[2]/div/div/div[2]/div[1]/form/div[2]/div/div/div/input")
    btn_login = driver.find_element('xpath',
                                    "/html/body/div[4]/div/div/div/div[2]/div[2]/div/div/div[2]/div/div/div[2]/div[1]/form/div[4]/button")

    input_email.send_keys(login)
    input_pass.send_keys(password)
    btn_login.click()

    time.sleep(3)

    if check_login_failed(BeautifulSoup(driver.page_source, "html.parser")):
        return None

    try:
        username = find_username_from_soup(
            BeautifulSoup(driver.page_source, "html.parser"))
        _hrank_session = driver.get_cookie("_hrank_session")

        return username, _hrank_session["value"]

    except Exception as e:
        print(e)
        return None


def run_helper(login, password):
    helper = SeleniumHelper(retrieve_hrank_session)
    return helper.run(login, password)
