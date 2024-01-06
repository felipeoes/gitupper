import re
from threading import Thread
from datetime import datetime
from gitupper.models import BeeSubmission, LeetSubmission, HackerSubmission, SubmissionTracker

TARGET_DATETIME_FORMAT = "%d/%m/%Y %H:%M:%S"


def convert_datetime_pattern(input_datetime: str or int, target=TARGET_DATETIME_FORMAT) -> datetime:
    # TARGET: "%d/%m/%Y %H:%M:%S""
    # US: 1/2/23, 5:25 PM
    # BR: 2/1/2023 17:25:00

    if isinstance(input_datetime, int):
        # convert timestamp to datetime
        return datetime.fromtimestamp(input_datetime)

    us = re.search(
        r'\d{1,2}/\d{1,2}/\d{2}, \d{1,2}:\d{1,2} [AP]M', input_datetime)
    br = re.search(
        r'\d{1,2}/\d{1,2}/\d{4} \d{1,2}:\d{1,2}:\d{1,2}', input_datetime)

    if us:
        return datetime.strptime(us.group(), "%m/%d/%y, %I:%M %p")
    elif br:
        return datetime.strptime(br.group(), "%d/%m/%Y %H:%M:%S")
    else:
        return datetime.strptime(input_datetime, target)


def format_datetime(datetime: str or int) -> datetime:
    """ Format datetime string or timestamp to datetime object """
    try:
        return convert_datetime_pattern(datetime)
    except:
        return None


def check_submissions_offset(gitupper_id, platform_prefix):
    submission_tracker = SubmissionTracker.objects.filter(
        gitupper_user_id=gitupper_id, platform_prefix=platform_prefix).first()

    if submission_tracker:
        return submission_tracker.content_object.id, submission_tracker.content_object.date_submitted
    else:
        return 0, None


def save_submissions_offset(gitupper_id, platform_prefix, last_submission):
    submission_tracker = SubmissionTracker.objects.filter(
        gitupper_user_id=gitupper_id, platform_prefix=platform_prefix).first()

    if submission_tracker:
        submission_tracker.content_object = last_submission
        submission_tracker.save()
    else:
        submission_tracker = SubmissionTracker(
            gitupper_user_id=gitupper_id,
            platform_prefix=platform_prefix,
            content_object=last_submission,
        )
        submission_tracker.save()


class BackgroundSubmissionsSaver(Thread):
    def run(self, *args, **kwargs):
        submissions_objs: list = self._args[0]
        platform_prefix: str = self._args[1]
        platform_user = self._args[2]

        platform = f"{platform_prefix.capitalize()}Submission"

        eval(platform).objects.bulk_create([eval(platform)(**{
            **submission_obj,
            "user": platform_user,
            # "date_submitted": format_datetime(submission_obj['date_submitted']) if platform_prefix == "bee" else submission_obj['date_submitted']
        }) for submission_obj in submissions_objs], ignore_conflicts=True)

        # Save submissions offset. Get last by common attribute 'date_submitted' in submisions_objs list
        last_submission = max(
            submissions_objs, key=lambda x: x['date_submitted'])

        serialized_submission = eval(
            f"{platform_prefix.capitalize()}Submission")(**last_submission)
        save_submissions_offset(
            platform_user.gitupper_user.gitupper_id, platform_prefix, serialized_submission)


def save_submissions(submissions_objs: list, platform_prefix: str, platform_user):
    t = BackgroundSubmissionsSaver(
        args=(submissions_objs, platform_prefix, platform_user), )
    t.start()
