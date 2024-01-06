from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.serializers import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.utils.crypto import get_random_string
from gitupper.user.utils import make_user_obj

from .serializers import (
    LoginTokenObtainPairSerializer,
    UserRegistrationSerializer,
    ChangePasswordSerializer,
)

from gitupper.models import User
from gitupper.mail_sender import send_mail
from gitupper.user.serializers import UsersSerializer

# User.objects.all().delete()


class LoginTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoginTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(email=request.data.get("email"))

        tokens = {
            "access": serializer.validated_data["access"],
            "refresh": serializer.validated_data["refresh"],
        }

        return Response(
            {"tokens": tokens, "user": UsersSerializer(user).data},
            status=status.HTTP_200_OK,
        )


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    # removendo a necessidade de autenticação para o usuário logar/se cadastrar
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(request)

        # make login after register
        user = User.objects.get(email=request.data.get("email"))
        login_serializer = LoginTokenObtainPairSerializer(
            data={"email": user.email, "password": request.data.get("password")}
        )
        login_serializer.is_valid(raise_exception=True)

        tokens = {
            "access": login_serializer.validated_data["access"],
            "refresh": login_serializer.validated_data["refresh"],
        }

        response = Response(
            {"user": UsersSerializer(user).data, "tokens": tokens},
            status=status.HTTP_201_CREATED,
        )

        return response


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken(refresh_token)
            token.blacklist()

            # remove all jwt tokens from the authenticated user
            # user = request.user

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        return response


# Somente método PUT


class ChangePasswordView(generics.UpdateAPIView):
    """
    An endpoint for changing password.
    """

    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (AllowAny,)  # ver se precisa mudar dps

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        is_authenticated = self.object.is_authenticated
        verify_token = request.data.get("token") or self.object.verify_token

        if serializer.is_valid() and is_authenticated:
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response(
                    {"old_password": ["Wrong password."]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if serializer.data.get("new_password0") == serializer.data.get(
                "old_password"
            ):
                raise ValidationError(
                    {"passwords": "A nova senha não pode ser igual a antiga"}
                )

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        if not is_authenticated and not verify_token:
            raise ValidationError(
                {"email": "Usuário não está autenticado e nenhum token foi informado"}
            )

        if serializer.data.get("new_password0") != serializer.data.get("new_password1"):
            raise ValidationError({"passwords": "As senhas não são iguais"})

        try:
            user = User.objects.get(verify_token=verify_token)

            user.set_password(serializer.data.get("new_password0"))
            user.save()

            response = {
                "success": True,
                "code": status.HTTP_200_OK,
                "message": "Senha atualizada com sucesso!",
            }

            user.verify_token = None  # removendo o token já utilizado
            return Response(response)

        except Exception as e:
            print(e)
            raise ValidationError({"token": "Token inválido"})


# @api_view(['POST'])
# @permission_classes([AllowAny, ])
# def reset_password_view(request):
#     email = request.data.get('email')

#     errors = {
#         "email": True,
#         "error": "Email não informado!"
#     }

#     if not email:
#         return Response(errors, status=status.HTTP_400_BAD_REQUEST)

#     verify_token = get_random_string(length=6).upper()

#     # Verificando se o email existe
#     try:
#         user = User.objects.get(email=email)
#         user.verify_token = verify_token
#         user.save()

#         send_mail(token=verify_token, text='Here is your password reset token',
#                   subject='password reset token', from_email='', to_emails=[email])

#         response = {
#             "title": "Email enviado com sucesso!",
#             "status": "success",
#             "message": "Enviamos um código para o email informado. Insira o código recebido no campo abaixo para recuperar sua senha!"
#         }

#         return Response(response)

#     except Exception as e:
#         print(e)
#         errors = {
#             "email": True,
#             "error": "Email não encontrado!"
#         }
#         return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """
    An endpoint for reset password.
    """

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")

        errors = {"email": True, "error": "Email não informado!"}

        if not email:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        verify_token = get_random_string(length=6).upper()

        # Verificando se o email existe
        try:
            user = User.objects.get(email=email)
            user.verify_token = verify_token
            user.save()

            send_mail(
                token=verify_token,
                text="Here is your password reset token",
                subject="password reset token",
                from_email="",
                to_emails=[email],
            )

            response = {
                "title": "Email enviado com sucesso!",
                "status": "success",
                "message": "Enviamos um código para o email informado. Insira o código recebido no campo abaixo para recuperar sua senha!",
            }

            return Response(response)

        except Exception as e:
            print(e)
            errors = {"email": True, "error": "Email não encontrado!"}
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# @permission_classes([AllowAny])
# def validate_reset_view(request):
#     token_received = request.data.get('token')

#     try:
#         user = User.objects.get(verify_token=token_received)

#         user_obj = make_user_obj(user)
#         user_obj["key"] = token_received

#         data = {
#             "title": "Código válido",
#             "success": True,
#             "message": "Código validado com sucesso! Agora basta alterar a sua senha :)",
#             "user": user_obj,
#             "status": "success",
#         }

#         return Response(data)
#     except Exception as e:
#         print(e)

#         errors = {
#             "token": True,
#             "error": "Token inválido!"
#         }
#         return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class ValidateResetView(APIView):
    """
    An endpoint for validate reset password.
    """

    def post(self, request, *args, **kwargs):
        token_received = request.data.get("token")

        try:
            user = User.objects.get(verify_token=token_received)

            user_obj = make_user_obj(user)
            user_obj["key"] = token_received

            data = {
                "title": "Código válido",
                "success": True,
                "message": "Código validado com sucesso! Agora basta alterar a sua senha :)",
                "user": user_obj,
                "status": "success",
            }

            return Response(data)
        except Exception as e:
            print(e)

            errors = {"token": True, "error": "Token inválido!"}
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
