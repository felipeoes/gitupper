import json
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from platforms.utils.commons import platforms
from platforms.submissions_fetcher import BackgroundSubmissionsDownloader

from .models import BeeUser, BeeSubmission, HackerUser, HackerSubmission, LeetUser, LeetSubmission, TemporaryProgress
from .serializers import BeeUsersSerializer, BeeSubmissionsSerializer, HackerUsersSerializer, HackerSubmissionsSerializer, LeetUsersSerializer, LeetSubmissionsSerializer, TemporaryProgressesSerializer
from .utils import bind_user, unbind_user, valid_platform_prefix, check_existing_submissions, retrieve_platform_user, zip_submissions

from gitupper.user.models import User
from gitupper.user.utils import make_user_obj, check_user_binded

from threading import Thread


# BeeSubmission.objects.all().delete()
# HackerSubmission.objects.all().delete()
# LeetSubmission.objects.all().delete()

def validate_platform_prefix(platform_prefix):
    if not valid_platform_prefix(platform_prefix):
        error = {
            "platform_prefix": True,
            "error": "Plataforma inválida"
        }
        return Response(error, status=status.HTTP_400_BAD_REQUEST)


class BeecrowdUsersViewSet(ModelViewSet):
    """Listing all beecrowd users"""
    queryset = BeeUser.objects.all()
    serializer_class = BeeUsersSerializer
    permission_classes = [IsAuthenticated]


class BeecrowdSubmissionsViewSet(ModelViewSet):
    """Listing all user Beecrowd submissions"""
    serializer_class = BeeSubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's submissions
        try:
            user = self.request.user
            bee_user = BeeUser.objects.get(gitupper_user=user)
            return BeeSubmission.objects.filter(user=bee_user)
        except Exception as e:
            print(e)
            return []


class HackerUsersViewSet(ModelViewSet):
    """Listing all hacker users"""
    queryset = HackerUser.objects.all()
    serializer_class = HackerUsersSerializer
    permission_classes = [IsAuthenticated]


class HackerSubmissionsViewSet(ModelViewSet):
    """Listing all user HackerRank submissions"""
    serializer_class = HackerSubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's submissions
        try:
            user = self.request.user
            hacker_user = HackerUser.objects.get(gitupper_user=user)
            return HackerSubmission.objects.filter(user=hacker_user)
        except Exception as e:
            print(e)
            return []


class LeetUsersViewSet(ModelViewSet):
    """ Listing all leetcode users """
    queryset = LeetUser.objects.all()
    serializer_class = LeetUsersSerializer
    permission_classes = [IsAuthenticated]


class LeetSubmissionsViewSet(ModelViewSet):
    """Listing all user LeetCode submissions"""
    serializer_class = LeetSubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's submissions
        try:
            user = self.request.user
            leet_user = LeetUser.objects.get(gitupper_user=user)
            return LeetSubmission.objects.filter(user=leet_user)
        except Exception as e:
            print(e)
            return []


class TemporaryProgressesViewSet(ModelViewSet):
    """Listing all temporary progresses"""
    queryset = TemporaryProgress.objects.all()
    serializer_class = TemporaryProgressesSerializer
    permission_classes = [IsAuthenticated]


# class BackgroundSubmissionsDownloader(Thread):
#     def __init__(self, *args, **kwargs):
#         super(BackgroundSubmissionsDownloader, self).__init__(*args, **kwargs)

#         self._return = None

#     def run(self, *args, **kwargs):
#         user = self._args[0]
#         gitupper_id = self._args[1]
#         platform_prefix = self._args[2]

#         user = globals()[f"get_{platform_prefix}_submissions"](
#             user, gitupper_id)

#         self._return = user

#     def join(self, *args, **kwargs):
#         super(BackgroundSubmissionsDownloader, self).join(*args, **kwargs)
#         return self._return


# @api_view(['POST'])
# @renderer_classes((JSONRenderer,))
# @permission_classes((IsAuthenticated,))
# def fetch_submissions_view(request):
#     user = request.user
#     gitupper_id = getattr(user, "gitupper_id")

#     body_json = json.loads(request.body)
#     platform_prefix: str = body_json.get('platform_prefix')
#     platform_user_class = globals()[f"{platform_prefix.capitalize()}User"]
#     platform_submission_class = globals(
#     )[f"{platform_prefix.capitalize()}Submission"]

#     # Checa se o usuário já tem submissões da 'platform_prefix' salvas no banco de dados
#     platform_user = platform_user_class.objects.get(
#         gitupper_user_id=gitupper_id)

#     submissions = platform_submission_class.objects.filter(
#         user=platform_user)

#     if len(submissions) > 0:
#         submissions = submissions.values()

#         data = {
#             f"{platform_prefix}_submissions": submissions
#         }

#         return Response(data, status=status.HTTP_200_OK)

#     # Caso contrário, faz o fetch das submissões da plataforma
#     gitupper_user = User.objects.get(gitupper_id=gitupper_id)

#     t = BackgroundSubmissionsDownloader(
#         args=(user, gitupper_id, platform_prefix), )
#     t.start()
#     res = t.join()  # Aguarda até a thread terminar

#     try:
#         error = getattr(res, f"{platform_prefix}_submissions")["error"]
#         if error:
#             unbind_user(gitupper_id, platform_prefix=platform_prefix)

#             errors = {
#                 "verification": True,
#                 **getattr(res, f"{platform_prefix}_submissions")
#             }

#             return Response(errors)
#     except Exception as e:
#         print(e)
#         pass

#     user_obj = make_user_obj(user, gitupper_user, platform=True)

#     return Response(user_obj)


class FetchSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        gitupper_id = getattr(user, "gitupper_id")
        data = request.data

        platform_prefix = data.get('platform_prefix')

        validate_platform_prefix(platform_prefix)

        platform_user_class = globals()[f"{platform_prefix.capitalize()}User"]
        platform_submission_class = globals(
        )[f"{platform_prefix.capitalize()}Submission"]

        # Checa se o usuário já tem submissões da 'platform_prefix' salvas no banco de dados
        platform_user = platform_user_class.objects.get(
            gitupper_user_id=gitupper_id)

        submissions = platform_submission_class.objects.filter(
            user=platform_user)

        if len(submissions) > 0:
            submissions = submissions.values()

            data = {
                f"{platform_prefix}_submissions": submissions
            }

            return Response(data, status=status.HTTP_200_OK)

        # Caso contrário, faz o fetch das submissões da plataforma
        gitupper_user = User.objects.get(gitupper_id=gitupper_id)

        t = BackgroundSubmissionsDownloader(
            args=(user, gitupper_id, platform_prefix), )
        t.start()
        res = t.join()  # Aguarda até a thread terminar

        try:
            error = getattr(res, f"{platform_prefix}_submissions")["error"]
            if error:
                unbind_user(gitupper_id, platform_prefix=platform_prefix)

                errors = {
                    "verification": True,
                    **getattr(res, f"{platform_prefix}_submissions")
                }

                return Response(errors)
        except Exception as e:
            print(e)
            pass

        user_obj = make_user_obj(user, gitupper_user, platform=True)

        return Response(user_obj)


class PlatformBindView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        login = data.get('login')
        password = data.get('password')
        session = data.get('session')
        platform_prefix = data.get('platform_prefix')

        validate_platform_prefix(platform_prefix)

        gitupper_id = request.user.gitupper_id

        # Check if the platform is already binded to the user

        platform_user = retrieve_platform_user(
            login, password, session, gitupper_id, platform_prefix)

        if not platform_user:
            error_message = f"Não foi possível autenticar o usuário {platforms[platform_prefix]['name']}"

            traditional_errors = {
                "login": True,
                "password": True,
                "token": False,
                "error": error_message
            }

            token_errors = {
                "login": False,
                "password": False,
                "token": True,
                "error": error_message
            }
            errors = token_errors if session else traditional_errors

            return Response(errors)

        is_binded = check_user_binded(
            gitupper_id, platform_prefix=platform_prefix, platform_id=getattr(platform_user, f"{platform_prefix}_id"))

        if is_binded is None:
            errors = {
                "email": True,
                "password": False,
                "error": f"Essa conta {platforms[platform_prefix]['name']} já está vinculada a outro usuário!"
            }

            return Response(errors)

        if not is_binded:
            bind_user(gitupper_id, platform_prefix=platform_prefix,
                      platform_id=getattr(platform_user, f"{platform_prefix}_id"))

        gitupper_user = User.objects.get(gitupper_id=gitupper_id)

        user_obj = check_existing_submissions(
            platform_user, gitupper_user, platform_prefix)

        user_obj = make_user_obj(platform_user, gitupper_user, platform=True)

        return Response(user_obj)


class PlatformUnbindView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data
        platform_prefix = data.get('platform_prefix')
        platform_id = getattr(user, f"{platform_prefix}_id")

        if platform_id:
            field = {f"{platform_prefix}_id": platform_id}
            user_model = globals()[f"{platform_prefix.capitalize()}User"]

            user = User.objects.get(**field)
            platform_user = user_model.objects.get(**field)
            setattr(user, f"{platform_prefix}_id", None)
            platform_user.gitupper_user_id = None
            user.save()
            platform_user.save()

            data = {
                "success": True,
                "message": f"Usuário {platforms[platform_prefix]['name']} desvinculado com sucesso!"
            }
            return Response(data)
        else:
            errors = {
                "success": False,
                "error": f"Não foi possível desvincular o usuário {platforms[platform_prefix]['name']}!"
            }

            return Response(errors)


class SubmissionsDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        body_json = json.loads(request.body)
        platform_prefix: str = body_json.get('platform_prefix')
        platform_id: str = body_json.get('platform_id')
        request_list = body_json.get('submissions_list')

        if platform_id:
            platform = globals()[f"{platform_prefix.capitalize()}Submission"]
            submissions = list(platform.objects.filter(user=platform_id))

            response = zip_submissions(
                submissions, request_list, platforms[platform_prefix]["submissions_dir"], platform_id)

        else:
            errors = {
                "success": False,
                "error": "Não foi possível baixar as submissões do usuário beecrowd!"
            }

            return Response(errors)
        return response


class ListUserBeeSubmissionsSerializer(ListAPIView):
    """Listando as submissões beecrowd dos usuários"""

    def get_queryset(self):
        queryset = BeeSubmission.objects.filter(
            user=self.kwargs['bee_id'])
        return queryset
    serializer_class = BeeSubmissionsSerializer


class ListUserHackerSubmissionsSerializer(ListAPIView):
    """Listando as submissões hackerrank dos usuários"""

    def get_queryset(self):
        queryset = HackerSubmission.objects.filter(
            user=self.kwargs['hacker_id'])
        return queryset
    serializer_class = HackerSubmissionsSerializer


class ListUserLeetSubmissionsSerializer(ListAPIView):
    """Listando as submissões beecrowd dos usuários"""

    def get_queryset(self):
        queryset = LeetSubmission.objects.filter(
            user=self.kwargs['leet_id'])
        return queryset
    serializer_class = LeetSubmissionsSerializer
