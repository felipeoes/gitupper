import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from gitupper_proj import routing, channelsmiddleware

settings_module = "gitupper_proj.production" if 'WEBSITE_HOSTNAME' in os.environ else 'gitupper_proj.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      settings_module)

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            channelsmiddleware.TokenAuthMiddleware(
                URLRouter(routing.websocket_urlpatterns))
        ),
    }
)
