
from datetime import datetime
from django.utils import timezone
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework.authentication import BasicAuthentication, TokenAuthentication
from django.utils.translation import gettext_lazy as _
from ..models import BeeSubmission, BeeUser, HackerUser, HackerSubmission, LeetUser, LeetSubmission, TemporaryProgress


def get_token_expired(self, obj):
    if obj.token_expires is None:
        return True
    return obj.token_expires < timezone.now() # uses django timezone instead of datetime because timezone.now() is timezone aware


class BeeUsersSerializer(ModelSerializer):
    token_expired = SerializerMethodField()

    get_token_expired = get_token_expired

    class Meta:
        model = BeeUser
        # get all fields (including token_expired) except access_token
        fields = [
            field.name for field in model._meta.fields if field.name != 'access_token'] + ['token_expired']


class BeeSubmissionsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = BeeSubmission
        fields = '__all__'


class HackerUsersSerializer(ModelSerializer):
    token_expired = SerializerMethodField()

    get_token_expired = get_token_expired

    class Meta:
        model = HackerUser
        fields = [
            field.name for field in model._meta.fields if field.name != 'access_token'] + ['token_expired']


class HackerSubmissionsSerializer(ModelSerializer):
    authentication_classes = [BasicAuthentication, TokenAuthentication]

    class Meta:
        model = HackerSubmission
        fields = '__all__'


class LeetUsersSerializer(ModelSerializer):
    token_expired = SerializerMethodField()

    get_token_expired = get_token_expired

    class Meta:
        model = LeetUser
        # get all fields except access_token
        fields = [
            field.name for field in model._meta.fields if field.name != 'access_token'] + ['token_expired']


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
