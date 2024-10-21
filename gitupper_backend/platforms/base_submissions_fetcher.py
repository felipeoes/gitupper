from abc import ABC, abstractmethod
from .auth import Authenticator

# Other submissions fetchers will implement this interface


class BaseSubmissionsFetcher(ABC):
    def __init__(self, user, gitupper_id: int, authenticator: Authenticator = None, options=None):
        self.__user = user
        self.__gitupper_id = gitupper_id
        self.__authenticator = authenticator
        self.__options = options

    @property
    def user(self):
        return self.__user

    @property
    def gitupper_id(self):
        return self.__gitupper_id

    @property
    def authenticator(self):
        return self.__authenticator
    
    @property
    def options(self):
        return self.__options
    
    @abstractmethod
    def fetch_submissions(self):
        pass

    def get_submissions(self):
        return self.fetch_submissions()
