import requests
import json
import os

from rest_framework import generics, status
from rest_framework.viewsets import ModelViewSet, ViewSet, GenericViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType

from gitupper.auth.serializers import User, LoginTokenObtainPairSerializer
from gitupper.user.utils import make_user_obj
from gitupper.user.serializers import UsersSerializer

from .models import (
    GithubUser,
    RepoComment,
    RepoCommentReply,
    RepoSubmission,
    RepoEvent,
    RepoEventReaction,
)
from .serializers import (
    GithubUsersSerializer,
    RepoCommentsSerializer,
    RepoCommentRepliesSerializer,
    RepoSubmissionsSerializer,
    RepoEventsSerializer,
)

# GithubUser.objects.all().delete()


class GithubUsersViewSet(ModelViewSet):
    """Listing will query only the authenticated user's github account."""

    queryset = GithubUser.objects.all()
    serializer_class = GithubUsersSerializer

    def get_queryset(self):
        return GithubUser.objects.filter(user=self.request.user)


class GithubOauthView(generics.GenericAPIView):
    # removendo a necessidade de autenticação para o usuário logar/se cadastrar
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        url = "https://github.com/login/oauth/access_token"

        header = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        }

        data = {
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "redirect_uri": os.getenv("REDIRECT_URI"),
            "code": request.data["code"],
        }

        result = requests.post(url, data=json.dumps(data), headers=header)
        has_token = "access_token" in result.text

        if not has_token or result.status_code != 200:
            return Response("Não foi possível autenticar o usuário!")

        params = result.text.split("=")
        token = params[1].split("&")[0]

        data = {"access_token": token}

        return Response(data)


class GithubVerifyView(generics.GenericAPIView):
    # removendo a necessidade de autenticação para o usuário logar/se cadastrar
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def bind_github_user(self, user, github_id, github_email, github_token):
        github_user, created = GithubUser.objects.get_or_create(
            github_id=github_id, github_email=github_email
        )
        github_user.github_access_token = github_token
        github_user.save()

        user.github_user = github_user
        user.save()

        return user

    def check_existing_user(self, github_id):
        # check if user is already binded with github_id
        user = User.objects.filter(github_user__github_id=github_id).first()

        if user:
            return make_user_obj(user)

        return None

    def check_user_registered_without_github(
        self, github_id, github_email, github_token
    ):
        # Look for user with same email as github email
        user = User.objects.filter(email=github_email).first()

        if user:
            # If it exists, then user is binding github account to existing gitupper account
            return self.bind_github_user(user, github_id, github_email, github_token)

        # check if user is already binded with github_id
        return self.check_existing_user(github_id)

    def check_gitupper_user(self, gitupper_id: int):
        # check if user already registered with gitupper_id
        return User.objects.filter(gitupper_id=gitupper_id).first()

    def success_response(self, github_id: int):
        data = {
            "success": True,
        }

        # recupera tokens jwt
        gitupper_user = User.objects.get(github_user__github_id=github_id)

        refresh = LoginTokenObtainPairSerializer.get_token(gitupper_user)

        data["user"] = UsersSerializer(gitupper_user).data  # type: ignore
        data["tokens"] = {  # type: ignore
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

        return Response(data)

    def post(self, request):
        gitupper_id = request.data.get("gitupper_id")
        github_email = request.data.get("github_email")
        github_id = request.data.get("github_id")
        github_token = request.data.get("github_token")

        error = {
            "error": True,
            "github_id": True,
            "token": True,
        }

        if not github_id or not github_token or not github_email:
            return Response(error)

        # check if user is already registered with diffrent email from github email
        user = self.check_gitupper_user(gitupper_id)

        # only bind github_id to user if it is not already binded
        if user and not self.check_existing_user(github_id):
            user = self.bind_github_user(user, github_id, github_email, github_token)

            return self.success_response(github_id)

        # check if user is already registered with email or github_id. And bind github_id to it if so
        user = self.check_user_registered_without_github(
            github_id, github_email, github_token
        )

        if user:
            # format user gituhub_user data
            return self.success_response(github_id)

        return Response(error)


class RepoEventsViewSet(ModelViewSet):
    """Listing all repo events"""

    serializer_class = RepoEventsSerializer
    permission_classes = [IsAuthenticated]


class RepoSubmissionsViewSet(ViewSet, GenericViewSet):
    """Listing all repo submissions"""

    queryset = RepoSubmission.objects.all()
    serializer_class = RepoSubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # buscando o pk do modelo e alterando o campo submission para o(s) objeto(s)
        try:
            if not isinstance(request.data, list):
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)

            pk = ContentType.objects.get(
                model=f"{request.data[0]['submission']}submission"
            ).pk
            for submission in request.data:
                submission["submission"] = pk
        except:
            pass

        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # headers = serializer.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RepoCommentsViewSet(ModelViewSet):
    """Listing all repo comments"""

    serializer_class = RepoCommentsSerializer
    permission_classes = [IsAuthenticated]

    class Meta:
        model = RepoComment
        fields = "__all__"
