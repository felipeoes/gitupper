from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from platforms.utils.commons import platforms


class GithubUser(models.Model):
    github_id = models.CharField(primary_key=True, max_length=100)
    github_email = models.EmailField(max_length=100, unique=True)
    github_access_token = models.CharField(max_length=100)

    def __str__(self):
        return str(self.github_id)


class RepoEvent(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(GithubUser, on_delete=models.CASCADE)
    # associated_submissions = models.ManyToManyField(
    #     RepoSubmission, blank=True)
    message = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    link = models.URLField(null=True, blank=True)

    class Meta:
        ordering = ['-date_created']

    def __str__(self):
        return str(self.id)


class RepoSubmission(models.Model):
    submission = models.ForeignKey(ContentType, on_delete=models.CASCADE, limit_choices_to={
                                   "model__in": [f"{platform_prefix}submission" for platform_prefix in platforms]})
    object_id = models.PositiveIntegerField(primary_key=True)
    content_object = GenericForeignKey('submission', 'object_id')
    repo_event = models.ForeignKey(RepoEvent, on_delete=models.CASCADE)


class RepoComment(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(GithubUser, on_delete=models.CASCADE)
    message = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    repo_event = models.ForeignKey(RepoEvent, on_delete=models.CASCADE)


class RepoCommentReply(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(GithubUser, on_delete=models.CASCADE)
    message = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    comment = models.ForeignKey(RepoComment, on_delete=models.CASCADE)


class RepoEventReaction(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(GithubUser, on_delete=models.CASCADE)
    reaction = models.CharField(max_length=20)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    repo_event = models.ForeignKey(RepoEvent, on_delete=models.CASCADE)
