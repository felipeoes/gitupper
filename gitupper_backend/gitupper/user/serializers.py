from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework.permissions import IsAuthenticated

from gitupper.serializers import BeeUsersSerializer, HackerUsersSerializer, LeetUsersSerializer, GithubUsersSerializer
from ..models import User, BeeUser, HackerUser, LeetUser
from platforms.utils.commons import platforms

DEFAULT_USER_IMG = 'user_default.png'


def default_user_img(user):
    if user.profile_image.name == DEFAULT_USER_IMG:
        return True
    return False


EXCLUDE_FIELDS = ['password', 'is_superuser', 'is_staff', 'is_active',
                  'date_joined', 'last_login', 'groups', 'user_permissions', 'verify_token']


class UsersSerializer(ModelSerializer):
    permission_classes = [IsAuthenticated]

    github_user = GithubUsersSerializer(read_only=True)
    platforms_users = SerializerMethodField()

    def get_platforms_users(self, obj):
        platforms_users = {}
        for platform in platforms:
            try:
                platform_user = eval(
                    f'{platform.capitalize()}User').objects.get(gitupper_user=obj)
                platforms_users[platform] = eval(
                    f'{platform.capitalize()}UsersSerializer')(platform_user).data
            except Exception as e:
                print(e)
                pass

        return platforms_users

    # if update profile_image, old one will be deleted

    def update(self, instance, validated_data):
        profile_image = validated_data.get('profile_image')
        if profile_image and not default_user_img(instance):
            instance.profile_image.delete()
        return super().update(instance, validated_data)

    def partial_update(self, instance, validated_data):
        profile_image = validated_data.get('profile_image')
        if profile_image and not default_user_img(instance):
            instance.profile_image.delete()
        return super().partial_update(instance, validated_data)

    def delete(self, instance):
        if not default_user_img(instance):
            instance.profile_image.delete()
        return super().delete(instance)

    class Meta:
        model = User

        exclude = EXCLUDE_FIELDS
