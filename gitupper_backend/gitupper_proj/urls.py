from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from rest_framework import routers

from gitupper.views import *

router = routers.DefaultRouter()
router.register("users", UsersViewSet, basename="Users")
# router.register('users-emails', UsersEmailsViewSet, basename='UsersEmails')
router.register(
    "bee-submissions", BeecrowdSubmissionsViewSet, basename="BeecrowdSubmissions"
)
router.register("bee-users", BeecrowdUsersViewSet, basename="BeecrowdUsers")
router.register("temp-progress", TemporaryProgressesViewSet, basename="TempProgresses")
router.register("hacker-users", HackerUsersViewSet, basename="HackerUsers")
router.register(
    "hacker-submissions", HackerSubmissionsViewSet, basename="HackerSubmissions"
)
router.register("leet-users", LeetUsersViewSet, basename="LeetUsers")
router.register("leet-submissions", LeetSubmissionsViewSet, basename="LeetSubmissions")
router.register("repo-events", RepoEventsViewSet, basename="RepoEvents")
router.register("repo-submissions", RepoSubmissionsViewSet, basename="RepoSubmissions")
router.register("repo-comments", RepoCommentsViewSet, basename="RepoComments")


# platforms_paths = [eval(f"path('users/submissions/{platforms[platform]['name']}/<{platform}_id>/', ListUser{platform.capitalize()}SubmissionsSerializer.as_view())") for platform in platforms]


class HealthCheckView(APIView):
    def get(self, request, format=None):
        return Response({"status": "ok"})


urlpatterns = [
    path("", include(router.urls)),
#     path("", include("chat.urls")),
    path("admin/", admin.site.urls),
    path("health/", HealthCheckView.as_view(), name="health_check"),
    path("api/v1/users/", include("gitupper.urls")),
    path("auth/github/", GithubOauthView.as_view(), name="GithubOauth"),
    path("verify/github", GithubVerifyView.as_view(), name="GithubVerify"),
    path("bind/platform/", PlatformBindView.as_view(), name="bind_platform"),
    path(
        "fetch/submissions/", FetchSubmissionsView.as_view(), name="fetch_submissions"
    ),
    path("unbind/platform/", PlatformUnbindView.as_view(), name="unbind_platform"),
    path(
        "download/submissions/",
        SubmissionsDownloadView.as_view(),
        name="download_submissions",
    ),
    # View for the progress of the submissions fetching. Websocket
    path(
        "api/v1/users/auth/reset-password/",
        ResetPasswordView.as_view(),
        name="reset_password",
    ),
    path(
        "api/v1/users/auth/validate-reset/",
        ValidateResetView.as_view(),
        name="validate_reset",
    ),
    path("users/github/<int:github_id>/", ListUserByGithubIdSerializer.as_view()),
    path(
        "users/submissions/beecrowd/<bee_id>/",
        ListUserBeeSubmissionsSerializer.as_view(),
    ),
    path(
        "users/submissions/hackerrank/<hacker_id>/",
        ListUserHackerSubmissionsSerializer.as_view(),
    ),
    path(
        "users/submissions/leetcode/<leet_id>/",
        ListUserLeetSubmissionsSerializer.as_view(),
    ),
    path(
        "api/v1/users/auth/change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
    #     *platforms_paths
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
