from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

from gitupper.github.models import GithubUser


def get_images_directory(instance, filename):
    return 'images/{filename}'.format(filename=filename)


class UserAdmin(BaseUserManager):
    def create_user(self, gitupper_id: int, email: str, password: str, first_name: str, last_name: str, github_user: GithubUser = None, profile_image=None):
        user = self.model(
            gitupper_id=gitupper_id,
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
            github_user=github_user,
            profile_image=profile_image
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, gitupper_id: int, email: str, password: str, first_name: str, last_name: str):
        user = self.create_user(
            gitupper_id=gitupper_id,
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        user.is_staff = True
        user.is_admin = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractUser):
    username = None
    gitupper_id = models.BigAutoField(primary_key=True)
    email = models.EmailField(verbose_name='email', max_length=60, unique=True)
    profile_image = models.ImageField(
        _("Image"), upload_to=get_images_directory, null=True, default='images/user_default.png')
    first_name = models.CharField(verbose_name='first_name', max_length=30)
    last_name = models.CharField(verbose_name='last_name', max_length=30)
    github_user = models.ForeignKey(
        GithubUser, on_delete=models.SET_NULL, null=True, blank=True
    )
    verify_token = models.CharField(max_length=64, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['gitupper_id', 'first_name', 'last_name']

    objects = UserAdmin()

    def __str__(self):
        return self.first_name + ' - ' + str(self.gitupper_id)
