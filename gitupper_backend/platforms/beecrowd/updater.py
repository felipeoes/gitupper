import json
import concurrent.futures

from .config import *
from threading import Thread, Event
from requests_html import HTMLSession

n_problems_pages = 0
categories_dict = {}


def get_all_problems_response(url, session):
    response = session.get(url, headers=base_headers)
    return response


def save_categories(categories_dict):
    with open("categories.json", "w", encoding="utf-8") as write_file:
        json.dump(categories_dict, write_file, indent=4, ensure_ascii=False)


def get_problem_info(problem):
    problem_fields = problem.text.split('\n')

    problem_obj = {problem_fields[0]: problem_fields[2]}
    categories_dict.update(problem_obj)

    return problem_obj


def extract_categories(response):
    global n_problems_pages, categories_dict

    problems_tr = [submission for submission in response.html.xpath(
        '//*[@id="element"]/table/tbody')[0].find('tr')]

    with concurrent.futures.ThreadPoolExecutor() as problems_executor:
        {problems_executor.submit(get_problem_info, problem): problem for problem in problems_tr}

    return categories_dict


class BackgroundProblemsFetcher(Thread):
    def run(self, *args, **kwargs):
        try:
            session = HTMLSession()
            response = session.get(
                beecrowd_all_problems_url, headers=base_headers)

            n_pages = int(response.html.xpath(
                '//*[@id="table-info"]')[0].text.split(" ")[-1])

            urls = [f"{beecrowd_all_problems_url}?page={page_num}" for page_num in range(
                    1, n_pages + 1)]

            with concurrent.futures.ThreadPoolExecutor() as pages_executor:
                responses = {pages_executor.submit(get_all_problems_response, url,
                                                   session): url for url in urls}

            with concurrent.futures.ThreadPoolExecutor() as executor:
                {executor.submit(extract_categories, response): response for response in [
                    res.result() for res in concurrent.futures.as_completed(responses)]}
                executor.shutdown(wait=True)

            # deixa o dicionário de categorias disponível para uso
            save_categories(categories_dict)
        except Exception as e:
            print(e)


t = BackgroundProblemsFetcher()


def setInterval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = Event()

            def loop():  # executed in another thread
                while not stopped.wait(interval):  # until stopped
                    function(*args, **kwargs)

            t = Thread(target=loop)
            t.daemon = True
            t.start()
            return stopped
        return wrapper
    return decorator


@setInterval(60)  # intervalo de uma hora
def initialize_bg_fetcher():
    global t
    if not t.is_alive():
        t = BackgroundProblemsFetcher()
        t.start()
