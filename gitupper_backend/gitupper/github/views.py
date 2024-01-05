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


from .models import RepoComment, RepoCommentReply, RepoSubmission, RepoEvent, RepoEventReaction
from.serializers import RepoCommentsSerializer, RepoCommentRepliesSerializer, RepoSubmissionsSerializer, RepoEventsSerializer


class GithubOauthView(generics.GenericAPIView):
    # removendo a necessidade de autenticação para o usuário logar/se cadastrar
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        url = "https://github.com/login/oauth/access_token"

        header = {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }

        data = {
            "client_id": os.getenv('CLIENT_ID'),
            "client_secret": os.getenv('CLIENT_SECRET'),
            "redirect_uri": os.getenv('REDIRECT_URI'),
            "code": request.data['code'],
        }

        result = requests.post(url,  data=json.dumps(data), headers=header)
        has_token = "access_token" in result.text

        if not has_token or result.status_code != 200:
            return Response('Não foi possível autenticar o usuário!')

        params = result.text.split("=")
        token = params[1].split("&")[0]

        data = {
            "access_token": token
        }

        return Response(data)


class GithubVerifyView(generics.GenericAPIView):
    # removendo a necessidade de autenticação para o usuário logar/se cadastrar
    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        github_id = request.data['github_id']
        token = request.data['token']

        error = {
            "error": True,
            "github_id": True,
            "token": True,
        }

        if not github_id or not token:
            return Response(error)

        try:
            user = User.objects.get(github_id=github_id)

            user_obj = make_user_obj(user)

            data = {
                "user": user_obj,

                "success": True,
            }

            # recupera tokens jwt
            refresh = LoginTokenObtainPairSerializer.get_token(user)

            data['tokens'] = {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            return Response(data)
        except:
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
                model=f"{request.data[0]['submission']}submission").pk
            for submission in request.data:
                submission['submission'] = pk
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
        fields = '__all__'
