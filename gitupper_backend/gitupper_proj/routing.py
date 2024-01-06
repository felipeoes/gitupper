from django.urls import path, include
from gitupper.consumers import TemporaryProgressConsumer

# Here, "" is routing to the URL ChatConsumer which
# will handle the chat functionality.
websocket_urlpatterns = [
    path("ws/progress/<int:gitupper_id>/", TemporaryProgressConsumer.as_asgi()),
]
