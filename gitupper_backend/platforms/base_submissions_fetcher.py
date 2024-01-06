from abc import ABC, abstractmethod

# Other submissions fetchers will implement this interface


class BaseSubmissionsFetcher(ABC):
    def __init__(self, user, gitupper_id: int, options=None):
        self.__user = user
        self.__options = options
        self.__gitupper_id = gitupper_id

    @property
    def user(self):
        return self.__user

    @property
    def options(self):
        return self.__options

    @property
    def gitupper_id(self):
        return self.__gitupper_id

    @abstractmethod
    def fetch_submissions(self):
        pass

    def get_submissions(self):
        return self.fetch_submissions()
