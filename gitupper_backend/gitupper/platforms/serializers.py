from rest_framework.serializers import ModelSerializer
from rest_framework.authentication import BasicAuthentication, TokenAuthentication
from django.utils.translation import gettext_lazy as _
from ..models import BeeSubmission, BeeUser, HackerUser, HackerSubmission, LeetUser, LeetSubmission, TemporaryProgress


class BeeUsersSerializer(ModelSerializer):
    class Meta:
        model = BeeUser
        fields = ['bee_id', 'gitupper_user', 'email', 'first_name',
                  'last_name']


class BeeSubmissionsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]
    
    class Meta:
        model = BeeSubmission
        fields = '__all__'


class HackerUsersSerializer(ModelSerializer):
    class Meta:
        model = HackerUser
        fields = ['hacker_id', 'gitupper_user', 'email', 'first_name',
                  'last_name']


class HackerSubmissionsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = HackerSubmission
        fields = '__all__'


class LeetUsersSerializer(ModelSerializer):
    class Meta:
        model = LeetUser
        fields = ['leet_id', 'gitupper_user', 'email', 'first_name',
                  'last_name']


class LeetSubmissionsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = LeetSubmission
        fields = '__all__'


class TemporaryProgressesSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = TemporaryProgress
        fields = '__all__'
