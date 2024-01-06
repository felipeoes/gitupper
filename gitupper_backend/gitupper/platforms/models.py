from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from gitupper.user.models import User
from platforms.utils.commons import platforms


# A class that will be used to track the submissions of a user. It will store the offset of the last submission that was fetched and the time of the last fetch. So that the next time the submissions are fetched, only the new submissions are fetched.
class SubmissionTracker(models.Model):
    gitupper_user = models.ForeignKey(
        User, on_delete=models.CASCADE)
    platform_prefix = models.CharField(max_length=10)

    # last_submission is the generic model field that can be any of the Submission models. It will be used to store the last submission that was fetched.
    last_submission = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('last_submission', 'object_id')

    def __str__(self):
        return ""

    class Meta:
        # Unique constraint on the gitupper_user and platform_prefix fields. This will ensure that there is only one SubmissionTracker object for each user and platform.
        constraints = [
            models.UniqueConstraint(
                fields=['gitupper_user', 'platform_prefix'], name='unique_user_platform')
        ]


# All submissions models will call this method on delete. It will delete the SubmissionTracker object that is associated with the submission.
def delete_submission_tracker(sender, instance, **kwargs):
    submission_tracker = SubmissionTracker.objects.filter(
        last_submission=ContentType.objects.get_for_model(instance)).first()
    submission_tracker.delete()


class BeeUser(models.Model):
    gitupper_user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True)
    bee_id = models.CharField(primary_key=True, max_length=9, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    access_token = models.CharField(max_length=256, null=True)
    token_expires = models.DateTimeField(null=True)

    def __str__(self):
        return self.bee_id


class BeeSubmission(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(BeeUser, on_delete=models.CASCADE)
    problem_number = models.IntegerField()
    problem_name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    prog_language = models.CharField(max_length=20)
    time = models.CharField(max_length=5)
    date_submitted = models.DateTimeField()
    source_code = models.TextField()
    filename = models.CharField(max_length=100)

    def __str__(self):
        return str(self.id + self.problem_number)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        delete_submission_tracker(sender=self.__class__, instance=self)


class HackerUser(models.Model):
    gitupper_user = models.OneToOneField(
        User, on_delete=models.CASCADE,  null=True)
    hacker_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    access_token = models.CharField(max_length=256, null=True)
    token_expires = models.DateTimeField(null=True)

    def __str__(self):
        return str(self.hacker_id)


class HackerSubmission(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(HackerUser, on_delete=models.CASCADE)
    problem_name = models.CharField(max_length=100)
    challenge_id = models.IntegerField()
    contest_id = models.IntegerField()
    status = models.CharField(max_length=50)
    prog_language = models.CharField(max_length=20)
    category = models.CharField(max_length=20)
    date_submitted = models.DateTimeField()
    source_code = models.TextField()
    display_score = models.FloatField()
    filename = models.CharField(max_length=100)

    def __str__(self):
        return str(self.id + self.challenge_id)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        delete_submission_tracker(sender=self.__class__, instance=self)


class LeetUser(models.Model):
    gitupper_user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True)
    leet_id = models.CharField(primary_key=True, max_length=9, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    access_token = models.CharField(max_length=1024, null=True)
    token_expires = models.DateTimeField(null=True)

    def __str__(self):
        return self.leet_id


class LeetSubmission(models.Model):
    id = models.CharField(primary_key=True, max_length=50)
    user = models.ForeignKey(LeetUser, on_delete=models.CASCADE)
    problem_number = models.IntegerField()
    problem_name = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    prog_language = models.CharField(max_length=20)
    category = models.CharField(max_length=20)
    date_submitted = models.DateTimeField()
    source_code = models.TextField()
    filename = models.CharField(max_length=100)

    def __str__(self):
        return (self.id + self.problem_name)

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        delete_submission_tracker(sender=self.__class__, instance=self)


class TemporaryProgress(models.Model):
    gitupper_id = models.BigIntegerField(primary_key=True)
    value = models.IntegerField()

    def __str__(self):
        return (str(self.value) + ' - ' + str(self.gitupper_id))
