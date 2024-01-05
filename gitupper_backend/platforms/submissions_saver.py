import re
from threading import Thread
from datetime import datetime
from gitupper.models import BeeSubmission, LeetSubmission, HackerSubmission


def format_datetime(string: str):
    pattern_BR = "%d/%m/%Y"
    pattern_US = "%m/%d/%y"

    string = re.sub('[,PAM]', '', string)
    try:
        return datetime.strptime(string, pattern_BR)
    except Exception as e:
        print(e)
        # específico do beecrowd, removendo o espaço no final
        return datetime.strptime(string, pattern_US)


class BackgroundSubmissionsSaver(Thread):
    def run(self, *args, **kwargs):
        submissions_objs: list = self._args[0]
        platform_prefix: str = self._args[1]
        platform_user = self._args[2]

        platform = f"{platform_prefix.capitalize()}Submission"

        unique_submissions = [
            dict(t) for t in {tuple(d.items()) for d in submissions_objs}]

        eval(platform).objects.bulk_create([eval(platform)(**{
            **submission_obj,
            "user": platform_user,
            "date_submitted": format_datetime(submission_obj['date_submitted'].split(" ")[0]) if platform_prefix == "bee" else submission_obj['date_submitted']
        }) for submission_obj in unique_submissions])

        # eval(platform).objects.bulk_create([eval(platform)(**{
        #     "user": platform_user,
        #     "id": submission_obj["id"],
        #     "problem_number": submission_obj["problem_number"],
        #     "problem_name": submission_obj["problem_name"],
        #     "category": submission_obj["category"],
        #     "status": submission_obj["status"],
        #     "prog_language": submission_obj["prog_language"],
        #     "time": submission_obj["time"],
        #     "date_submitted": format_datetime(submission_obj['date_submitted'].split(" ")[0]) if platform_prefix.lower() == "bee" else submission_obj['date_submitted'],
        #     "source_code": submission_obj["source_code"],
        #     "filename": submission_obj["filename"]
        # }) for submission_obj in unique_submissions])

        # for submission_obj in submissions_objs:
        #     if platform_prefix == "Bee":
        #         formatted_date_submitted = format_datetime(
        #             submission_obj['date_submitted'].split(" ")[0])

        #         submission_obj["date_submitted"] = formatted_date_submitted

        #     submission = globals()[f"{platform}"](
        #         **submission_obj, user=platform_user)

        #     submission.save()


def save_submissions(submissions_objs: list, platform_prefix: str, platform_user):
    t = BackgroundSubmissionsSaver(
        args=(submissions_objs, platform_prefix, platform_user), )
    t.start()
