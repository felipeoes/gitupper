import json
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from platforms.utils.commons import platforms
from platforms.submissions_fetcher import BackgroundSubmissionsDownloader

from .models import BeeUser, BeeSubmission, HackerUser, HackerSubmission, LeetUser, LeetSubmission, TemporaryProgress, SubmissionTracker
from .serializers import BeeUsersSerializer, BeeSubmissionsSerializer, HackerUsersSerializer, HackerSubmissionsSerializer, LeetUsersSerializer, LeetSubmissionsSerializer, TemporaryProgressesSerializer, get_token_expired
from .utils import valid_platform_prefix, retrieve_platform_user, zip_submissions

from gitupper.user.models import User
from gitupper.user.serializers import UsersSerializer
from gitupper.user.utils import make_user_obj, check_user_binded

from threading import Thread


# User.objects.all().delete()
# BeeSubmission.objects.all().delete()
# HackerSubmission.objects.all().delete()
# LeetSubmission.objects.all().delete()
# SubmissionTracker.objects.all().delete()

def validate_platform_prefix(platform_prefix):
    if not valid_platform_prefix(platform_prefix):
        return False
    return True


def parse_request_data(request):
    try:
        return request.data
    except Exception as e:
        data = json.loads(request.body)
        return data


def ordered_submissions(submissions):
    return sorted(submissions, key=lambda submission: submission.date_submitted, reverse=True)


class BeecrowdUsersViewSet(ModelViewSet):
    """Listing all beecrowd users"""
    serializer_class = BeeUsersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's info
        try:
            user = self.request.user
            bee_user = BeeUser.objects.get(gitupper_user=user)
            return [bee_user]
        except Exception as e:
            print(e)
            return []


class BeecrowdSubmissionsViewSet(ModelViewSet):
    """Listing all user Beecrowd submissions"""
    serializer_class = BeeSubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's submissions
        try:
            user = self.request.user
            bee_user = BeeUser.objects.get(gitupper_user=user)
            return BeeSubmission.objects.filter(user=bee_user).order_by('-date_submitted')
        except Exception as e:
            print(e)
            return []


class HackerUsersViewSet(ModelViewSet):
    """Listing all hacker users"""
    serializer_class = HackerUsersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's info
        try:
            user = self.request.user
            hacker_user = HackerUser.objects.get(gitupper_user=user)
            return [hacker_user]
        except Exception as e:
            print(e)
            return []


class HackerSubmissionsViewSet(ModelViewSet):
    """Listing all user HackerRank submissions"""
    serializer_class = HackerSubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's submissions
        try:
            user = self.request.user
            hacker_user = HackerUser.objects.get(gitupper_user=user)
            return HackerSubmission.objects.filter(user=hacker_user).order_by('-date_submitted')
        except Exception as e:
            print(e)
            return []


class LeetUsersViewSet(ModelViewSet):
    """ Listing all leetcode users """
    serializer_class = LeetUsersSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's info
        try:
            user = self.request.user
            leet_user = LeetUser.objects.get(gitupper_user=user)
            return [leet_user]
        except Exception as e:
            print(e)
            return []


class LeetSubmissionsViewSet(ModelViewSet):
    """Listing all user LeetCode submissions"""
    serializer_class = LeetSubmissionsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's submissions
        try:
            user = self.request.user
            leet_user = LeetUser.objects.get(gitupper_user=user)
            return LeetSubmission.objects.filter(user=leet_user).order_by('-date_submitted')
        except Exception as e:
            print(e)
            return []


class TemporaryProgressesViewSet(ModelViewSet):
    """Listing authenticated user's temporary progress"""
    serializer_class = TemporaryProgressesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # get only the authenticated user's progress
        try:
            user = self.request.user
            return TemporaryProgress.objects.filter(gitupper_id=user.gitupper_id)
        except Exception as e:
            print(e)
            return []

# This view is only used when user first binds a platform account or logs in.
# To recover the user's submissions, the respective SubmissionViewSet should be used.


class FetchSubmissionsView(APIView):
    permission_classes = [IsAuthenticated]

    def validate_already_updated(self, res):
        return res.get('already_updated') if isinstance(res, dict) and 'already_updated' in res else False

    def validate_errors(self, res):
        if res is not None:
            return res.get('error') if isinstance(res, dict) or 'error' in res else False
        return False

    def check_user_binded(self, platform_prefix, user):
        try:
            platform_user_class = globals(
            )[f"{platform_prefix.capitalize()}User"]
            platform_user = platform_user_class.objects.get(gitupper_user=user)
        except Exception as e:
            print(e)
            return None

        return platform_user

    def post(self, request):
        user = request.user
        gitupper_id = getattr(user, "gitupper_id")
        data = parse_request_data(request)

        platform_prefix = data.get('platform_prefix')

        valid_prefix = validate_platform_prefix(platform_prefix)
        if not valid_prefix:
            error = {
                "platform_prefix": True,
                "error": "Plataforma inválida"
            }

            print(error)
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        platform_user_class = globals()[f"{platform_prefix.capitalize()}User"]
        platform_submission_class = globals(
        )[f"{platform_prefix.capitalize()}Submission"]

        # checks if user is binded to the target platform
        binded = self.check_user_binded(platform_prefix, user)
        if not binded:
            error = {
                "platform_prefix": True,
                "error": "Usuário não vinculado a plataforma"
            }

            print(error)
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        try:
            t = BackgroundSubmissionsDownloader(
                args=(user, gitupper_id, platform_prefix), )
            t.start()
            res = t.join()  # Wait for thread to finish. if there are no errors, return res will be a list of submissions
        except Exception as e:
            print(e)
            return Response({"error": "Erro ao tentar baixar submissões"})

        if self.validate_errors(res):
            errors = {
                "verification": True,
                **res
            }
            print(errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        platform_user = platform_user_class.objects.get(
            gitupper_user_id=gitupper_id)

        if self.validate_already_updated(res):
            # add existing submissions to the response
            submissions = platform_submission_class.objects.filter(
                user=platform_user).order_by('-date_submitted')

            if len(submissions) > 0:
                # Serialize submissions. Return at most 100 submissions. Later, frontend will fetch more with pagination
                submissions = eval(f"{platform_prefix.capitalize()}SubmissionsSerializer")(
                    submissions, many=True).data[:100]
                return Response(submissions)

        # concat existing submissions with new submissions
        older_submissions = eval(f"{platform_prefix.capitalize()}SubmissionsSerializer")(
            platform_submission_class.objects.filter(
                user=platform_user).order_by('-date_submitted'), many=True).data[:100]

        new_submissions = eval(f"{platform_prefix.capitalize()}SubmissionsSerializer")(
            res, many=True).data[:100]

        submissions = new_submissions + older_submissions

        return Response(submissions)


class PlatformBindView(APIView):
    permission_classes = [IsAuthenticated]

    def bind_user(self, user, platform_prefix):
        platform_field = f"{platform_prefix}user"
        platform_user = getattr(user, platform_field, None)

        if platform_user:
            setattr(platform_user, 'gitupper_user', user)
            setattr(platform_user, 'gitupper_user_id', user.gitupper_id)
            platform_user.save()

    def get_platform_token_valid(self, platform_user):
        if platform_user:
            return not get_token_expired(self, platform_user)

        return False

    def get_already_binded(self, user, platform_prefix):
        # check if user already has the target platform binded and platform token is valid
        platform_user = getattr(user, f"{platform_prefix}user", None)

        token_valid = self.get_platform_token_valid(platform_user)

        if platform_user and token_valid:
            return True

        return False

    def post(self, request):
        data = request.data
        user = request.user
        login = data.get('login')
        password = data.get('password')
        session = data.get('session')
        platform_prefix = data.get('platform_prefix')

        validate_platform_prefix(platform_prefix)

        gitupper_id = request.user.gitupper_id

        # check if user already has the target platform binded
        already_binded = self.get_already_binded(user, platform_prefix)

        if already_binded:
            return Response({"email": True,
                             "password": False,
                             "error": f"Você já está vinculado a uma conta da plataforma {platforms[platform_prefix]['name']}. Caso queira vincular outra conta, desvincule a atual primeiro."})

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

        field = {
            f'{platform_prefix}_id': getattr(platform_user, f'{platform_prefix}_id')
        }

        platform_model = globals(
        )[f"{platform_prefix.capitalize()}User"].objects.get(**field)

        is_binded = check_user_binded(
            gitupper_id, platform_prefix=platform_prefix, platform_user=platform_model)

        if is_binded is None:
            errors = {
                "email": True,
                "password": False,
                "error": f"Essa conta {platforms[platform_prefix]['name']} já está vinculada a outro usuário!"
            }

            return Response(errors)

        if not is_binded:
            self.bind_user(request.user, platform_prefix)

        # user_obj = check_existing_submissions(
        #     platform_user, gitupper_user, platform_prefix)

        user_obj = UsersSerializer(user).data
        # user_obj = make_user_obj(platform_user, gitupper_user, platform=True)

        return Response(user_obj)


class PlatformUnbindView(APIView):
    permission_classes = [IsAuthenticated]

    def unbind_user(self, user, platform_prefix):
        platform_field = f"{platform_prefix}user"
        platform_user = getattr(user, platform_field, None)

        if platform_user:
            setattr(platform_user, "gitupper_user", None)
            setattr(platform_user, "gitupper_user_id", None)
            platform_user.save()

    def post(self, request):
        user = request.user
        data = request.data
        platform_prefix = data.get('platform_prefix')

        platform_field = f"{platform_prefix}user"
        platform_user = getattr(user, platform_field, None)

        if platform_user:
            self.unbind_user(user, platform_prefix)

            data = {
                "success": True,
                "message": f"Usuário {platforms[platform_prefix]['name']} desvinculado com sucesso!",
                "user": UsersSerializer(user).data
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

        problem_name = self.request.query_params.get('problem_name', None)

        if problem_name is not None:
            queryset = queryset.filter(problem_name__icontains=problem_name)

        return queryset.order_by('-date_submitted')
    serializer_class = BeeSubmissionsSerializer


class ListUserHackerSubmissionsSerializer(ListAPIView):
    """Listando as submissões hackerrank dos usuários"""

    def get_queryset(self):
        queryset = HackerSubmission.objects.filter(
            user=self.kwargs['hacker_id'])

        problem_name = self.request.query_params.get('problem_name', None)

        if problem_name is not None:
            queryset = queryset.filter(problem_name__icontains=problem_name)

        return queryset.order_by('-date_submitted')

    serializer_class = HackerSubmissionsSerializer


class ListUserLeetSubmissionsSerializer(ListAPIView):
    """Listando as submissões beecrowd dos usuários"""

    def get_queryset(self):
        queryset = LeetSubmission.objects.filter(
            user=self.kwargs['leet_id'])

        problem_name = self.request.query_params.get('problem_name', None)

        if problem_name is not None:
            queryset = queryset.filter(problem_name__icontains=problem_name)

        return queryset.order_by('-date_submitted')
    serializer_class = LeetSubmissionsSerializer
