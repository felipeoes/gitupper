from django.db import models
from gitupper.user.models import User
from platforms.utils.commons import platforms

class BeeUser(models.Model):
    gitupper_user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True)
    bee_id = models.CharField(primary_key=True, max_length=9, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    access_token = models.CharField(max_length=256, null=True)

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
        return (self.id + self.problem_number)


class HackerUser(models.Model):
    gitupper_user = models.OneToOneField(
        User, on_delete=models.CASCADE,  null=True)
    hacker_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    access_token = models.CharField(max_length=256, null=True)

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
        return (self.id + self.challenge_id)


class LeetUser(models.Model):
    gitupper_user = models.OneToOneField(
        User, on_delete=models.CASCADE, null=True)
    leet_id = models.CharField(primary_key=True, max_length=9, unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, null=True, blank=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    access_token = models.CharField(max_length=1024, null=True)

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


class TemporaryProgress(models.Model):
    gitupper_id = models.BigIntegerField(primary_key=True)
    value = models.IntegerField()

    def __str__(self):
        return (self.value + ' - ' + self.gitupper_id)