from rest_framework.serializers import ModelSerializer
from rest_framework.permissions import IsAuthenticated
from ..models import User

DEFAULT_USER_IMG = 'user_default.png'


def default_user_img(user):
    if user.profile_image.name == DEFAULT_USER_IMG:
        return True
    return False


class UsersSerializer(ModelSerializer):
    permission_classes = [IsAuthenticated]

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

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
        fields = ['gitupper_id', 'email', 'first_name',
                  'last_name', 'profile_image', 'bee_id', 'hacker_id', 'github_id']
