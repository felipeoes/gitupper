from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _


def get_images_directory(instance, filename):
    return 'images/{filename}'.format(filename=filename)


class UserAdmin(BaseUserManager):
    def create_user(self, gitupper_id: int, email: str, password: str, first_name: str, last_name: str, bee_id: str = None, hacker_id: str = None, github_id: str = None, profile_image=None):
        user = self.model(
            gitupper_id=gitupper_id,
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
            bee_id=bee_id,
            hacker_id=hacker_id,
            github_id=github_id,
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
    bee_id = models.CharField(
        max_length=9, unique=True, null=True,)
    leet_id = models.CharField(max_length=50, unique=True, null=True,)
    hacker_id = models.IntegerField(unique=True, null=True)
    github_id = models.IntegerField(unique=True, null=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    verify_token = models.CharField(max_length=64, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['gitupper_id', 'first_name', 'last_name']

    objects = UserAdmin()

    def __str__(self):
        return self.first_name + ' - ' + str(self.gitupper_id)

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True
