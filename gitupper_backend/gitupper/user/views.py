from rest_framework.generics import ListAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from gitupper.permissions import IsAccountOwner

from .serializers import UsersSerializer
from .models import User


class UsersViewSet(ModelViewSet):
    """Only authenticated users can access this view, only the user can access their own info and only admins can access all users"""

    serializer_class = UsersSerializer

    permission_classes = [IsAuthenticated, IsAccountOwner]

    def get_queryset(self):
        if self.request.user.is_superuser:
            queryset = User.objects.all()
        else:
            queryset = User.objects.filter(
                gitupper_id=self.request.user.gitupper_id)

        return queryset


class ListUserByGithubIdSerializer(ListAPIView):
    """List users by github_id"""

    serializer_class = UsersSerializer

    def get_queryset(self):
        queryset = User.objects.filter(
            github_user__github_id=self.kwargs['github_id'])

        return queryset
