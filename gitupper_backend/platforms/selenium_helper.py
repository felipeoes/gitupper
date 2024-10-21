from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from undetected_chromedriver import Chrome

from threading import Thread
import time


class CloseDriverThread(Thread):
    def __init__(self, driver):
        Thread.__init__(self)
        self.driver = driver

    def run(self):
        time.sleep(3)
        self.driver.close()


class SeleniumHelper:
    def __init__(self, retrieve_session):
        self.retrieve_session = retrieve_session
        self.driver = webdriver.Chrome()
        self.close_driver_thread = CloseDriverThread(self.driver)

    def get_driver(self):
        return self.driver

    def driver_wait_number_of_windows_to_be(self, number):
        WebDriverWait(self.driver, 5).until(EC.number_of_windows_to_be(number))

    def driver_wait_frame_to_be_available_and_switch_to_it(self, by, value):
        WebDriverWait(self.driver, 5).until(EC.frame_to_be_available_and_switch_to_it((by, value)))
    def close(self):
        self.close_driver_thread.start()

    def run(self, *args, **kwargs):
        try:
            return self.retrieve_session(self.driver, *args, **kwargs)
        except Exception as e:
            print(e)
            self.close()
            return None
