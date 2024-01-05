import zipfile
import os
from django.http import HttpResponse
from gitupper.user.utils import make_user_obj

from platforms.utils.commons import format_submission, platforms
from .models import TemporaryProgress

# não são acessadas por conta da função globals()
from platforms.beecrowd.beecrowd import retrieve_bee_user, get_bee_submissions
from platforms.hackerrank.hackerrank import retrieve_hacker_user, get_hacker_submissions
from platforms.leetcode.leetcode import retrieve_leet_user, get_leet_submissions

# As importações dos models de submission abaixo são necessárias para o funcionamento da funcao de get_submissions, mesmo que não sejam usadas diretamente
from ..models import User, BeeSubmission, HackerSubmission, LeetSubmission


def valid_platform_prefix(platform_prefix: str):
    if platform_prefix not in platforms:
        return False
    return True

def bind_user(gitupper_id: int, platform_prefix: str,  platform_id):
    try:
        user = User.objects.get(gitupper_id=gitupper_id)
        setattr(user, f"{platform_prefix}_id", platform_id)
        user.save()
        return user
    except Exception as e:
        print(e)
        return False


def unbind_user(gitupper_id: int, platform_prefix: str):
    try:
        user = User.objects.get(gitupper_id=gitupper_id)
        setattr(user, f"{platform_prefix}_id", None)
        user.save()
        return user
    except Exception as e:
        print(e)
        return False


def delete_temp_progress(gitupper_id: int):
    try:
        temp_progress = TemporaryProgress.objects.get(gitupper_id=gitupper_id)
        temp_progress.delete()

        print("Temporary progress of user {} deleted".format(gitupper_id))
    except Exception as e:
        print(e)


def retrieve_platform_user(login: str, password: str, session: str, gitupper_id: int, platform_prefix: str):
    return globals()[f"retrieve_{platform_prefix}_user"](login, password, session, gitupper_id)


def get_source_code(submission):
    if hasattr(submission, 'source_code'):
        return submission.source_code
    else:
        return submission.code


def rename_zip_dirs(zip_dirs):
    zip_dirs = zip_dirs.split('/', 3)
    return zip_dirs[3]


def zip_submissions(submissions: list, request_list, platform_dir, user_id):
    requested_submissions = [
        submission for submission in submissions if submission.id in request_list]

    submissions_path = f"{platform_dir}/{user_id}/aceitas"

    response = HttpResponse(content_type='application/zip')
    zf = zipfile.ZipFile(response, 'w')

    for submission in requested_submissions:
        filename = submission.filename
        file = rename_zip_dirs(os.path.join(submissions_path, filename))
        zf.writestr(
            file, get_source_code(submission))

    zf.close()
    return response


def get_existing_submissions(user: any, gitupper_user: User, platform_prefix: str):
    platform = f"{platform_prefix.capitalize()}Submission"
    platform_id = getattr(user, f"{platform_prefix}_id")

    existing_submissions = globals()[f"{platform}"].objects.filter(
        user=platform_id)

    if existing_submissions.count() > 0:
        user_obj = make_user_obj(user, gitupper_user, True)
        user_obj[f"{platform_prefix}_submissions"] = [format_submission(
            submission, platform_prefix) for submission in existing_submissions]
        return user_obj
    return None


def check_existing_submissions(user, gitupper_user, platform_prefix=None):
    if platform_prefix:
        globals()[f"{platform_prefix}_submissions"] = get_existing_submissions(
            user, gitupper_user, platform_prefix)
        return globals()[f"{platform_prefix}_submissions"]

    user_obj = user

    for platform in platforms:
        globals()[f"{platform}_submissions"] = get_existing_submissions(
            user_obj, gitupper_user, platform)

    return user_obj
