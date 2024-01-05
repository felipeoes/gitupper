from platforms.selenium_helper import SeleniumHelper
from .config import beecrowd_login_url

import time


def check_login_success(page_source: str):
    if "/judge/pt/profile/" in page_source:
        return True
    return False


def retrieve_judge_session(helper: SeleniumHelper, email, password):
    driver = helper.get_driver()
    RETRIES = 3
    # options = webdriver.ChromeOptions()
    # options.add_experimental_option("excludeSwitches", ["enable-automation"])
    # options.add_experimental_option('useAutomationExtension', False)
    # options.add_argument("--disable-blink-features=AutomationControlled")

    # driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)

    # response = s.get(beecrowd_login_url)

    while RETRIES > 0:
        try:
            driver.get(beecrowd_login_url)

            input_email = driver.find_element('xpath',
                                              "/html/body/div[1]/div/div[2]/div[1]/form/div[2]/input")
            input_pass = driver.find_element('xpath',
                                             "/html/body/div[1]/div/div[2]/div[1]/form/div[3]/input")
            btn_login = driver.find_element('xpath',
                                            "/html/body/div[1]/div/div[2]/div[1]/form/div[5]/input")

            time.sleep(3)

            input_email.send_keys(email)
            input_pass.send_keys(password)
            btn_login.click()
            windows_before = driver.current_window_handle

            time.sleep(3)

            # Cloudflare bypass
            if not check_login_success(driver.page_source):
                helper.driver_wait_number_of_windows_to_be(2)
                windows_after = driver.window_handles
                new_window = [
                    x for x in windows_after if x != windows_before][0]

                # driver.switch_to_window(new_window) <!---deprecated>
                driver.switch_to.window(new_window)

                helper.driver_wait_frame_to_be_available_and_switch_to_it(
                    'id', 'myframe')
                # WebDriverWait(driver, 5).until(EC.frame_to_be_available_and_switch_to_it(
                #     (By.ID, "myframe")))  # or By.NAME, By.XPATH, By.CSS_SELECTOR

                print('Resetting driver')
                handle = driver.current_window_handle

                time.sleep(6)
                driver.switch_to.window(handle)

            try:
                cookies_list = []
                cookies = ['judge', 'csrfToken', '__cf_bm']
                profile_link = driver.find_element('xpath',
                                                   "/html/body/div[3]/header/div/div[1]/div[1]/ul/li[1]/a").get_attribute('href')
                for cookie in cookies:
                    cookies_list.append(driver.get_cookie(cookie))

                return cookies_list, profile_link, driver
            except Exception as e:
                print(e)
                return None

            else:
                return None
        except Exception as e:
            print(e)
            RETRIES -= 1
            helper.close()
            continue

    try:
        driver.find_element('xpath',
                            "//*[@id='tab-1-content-1']/div[1]/div").text
        return None
    except Exception as e:
        username = driver.find_element('xpath',
                                       "/html/body/div[4]/div/div/div/div/div[1]/nav/div/div[2]/ul[2]/li[3]/div/div/span").text
        csrfToken = driver.get_cookie("csrfToken")
        return csrfToken


def run_helper(login, password):
    helper = SeleniumHelper()
    cookies, profile_link, driver = retrieve_judge_session(
        helper, login, password)
    return cookies, profile_link, driver
