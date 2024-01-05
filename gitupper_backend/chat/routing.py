from django.urls import re_path, path

from .consumers import RepoConsumer

websocket_urlpatterns = [
    # re_path(r'ws/repos/(?P<page_name>\w+)/$', RepoConsumer.as_asgi()),
    path('ws/repos/<str:page_name>/<int:gitupper_id>/', RepoConsumer.as_asgi()),
]
