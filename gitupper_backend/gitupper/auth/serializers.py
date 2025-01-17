from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token
from django.utils.translation import gettext_lazy as _

from gitupper.user.serializers import UsersSerializer
from gitupper.github.serializers import GithubUsersSerializer
from gitupper.github.models import GithubUser
from gitupper.user.utils import check_user_binded
from gitupper.platforms.serializers import (
    BeeUsersSerializer,
    HackerUsersSerializer,
    LeetUsersSerializer,
)

from platforms.utils.commons import platforms

# As importações dos models de submission abaixo são necessárias para o funcionamento da funcao de get_submissions, mesmo que não sejam usadas diretamente
from ..models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    # removendo a necessidade de autenticação para o usuário logar/se cadastrar
    authentication_classes = ()
    permission_classes = [
        AllowAny,
    ]

    password2 = serializers.CharField(style={"input_type": "password"}, write_only=True)

    class Meta:
        model = User
        fields = [
            "email",
            "first_name",
            "last_name",
            "password",
            "password2",
            "github_user",
            "profile_image",
        ]
        extra_kwargs = {"password": {"write_only": True}}
        
    def save(self, request, *args, **kwargs):
        try:
            profile_image = request.data.get("profile_image")
            if profile_image:
                profile_image = self.validated_data["profile_image"]
            else:
                profile_image = "images/user_default.png"
            user = User(
                email=self.validated_data.get("email"),
                first_name=self.validated_data.get("first_name"),
                last_name=self.validated_data.get("last_name"),
                github_user=self.validated_data.get("github_user"),
                profile_image=profile_image,
            )

            password = self.validated_data["password"]
            password2 = self.validated_data["password2"]

            if password != password2:
                raise serializers.ValidationError({"password": "Passwords must match."})
            user.set_password(password)
            user.save()

            # send_email_verification(self.validated_data['email'])
            return user
        except Exception as e:
            raise serializers.ValidationError(e)


class LoginTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        return super().get_token(user)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if email and password:
            if User.objects.filter(email=email).exists():
                user = authenticate(
                    request=self.context.get("request"), email=email, password=password
                )

            else:
                msg = {"detail": "Email não está registrado.", "register": False}
                raise serializers.ValidationError(msg)

            if not user:
                msg = {
                    "detail": "Não foi possível logar com os dados fornecidos.",
                    "register": True,
                }
                raise serializers.ValidationError(msg, code="authorization")

        else:
            msg = 'Você deve incluir o email e a senha".'
            raise serializers.ValidationError(msg, code="authorization")

        data = super().validate(attrs)

        refresh = self.get_token(self.user)
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        return data


class ChangePasswordSerializer(serializers.Serializer):
    model = User
    """
    Serializer for password change endpoint.
    """
    new_password0 = serializers.CharField(required=True)
    new_password1 = serializers.CharField(required=True)
    old_password = serializers.CharField(required=False)
    email = serializers.EmailField(required=False, max_length=60)


class TokenSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)

    class Meta:
        model = Token
        fields = ("key", "user")
