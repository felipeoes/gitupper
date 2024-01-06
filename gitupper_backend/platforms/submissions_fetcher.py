from threading import Thread

# Esses métodos serão acessados dinamicamente
from platforms.beecrowd.beecrowd import get_bee_submissions
from platforms.hackerrank.hackerrank import get_hacker_submissions
from platforms.leetcode.leetcode import get_leet_submissions


class BackgroundSubmissionsDownloader(Thread):
    def __init__(self, *args, **kwargs):
        super(BackgroundSubmissionsDownloader, self).__init__(*args, **kwargs)

        self._return = None

    def run(self, *args, **kwargs):
        try:
            user = self._args[0]
            gitupper_id = self._args[1]
            platform_prefix = self._args[2]

            user = globals()[f"get_{platform_prefix}_submissions"](
                user, gitupper_id)

            self._return = user
        except Exception as e:
            print(e)
            error = {
                "error": "Não foi possível baixar as submissões. Tente novamente mais tarde ou verifique se o seu token de acesso expirou."
            }

            self._return = error
            return error

    def join(self, *args, **kwargs):
        super(BackgroundSubmissionsDownloader, self).join(*args, **kwargs)
        return self._return
