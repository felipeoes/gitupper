"""
ASGI config for gitupper_proj project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os
import django
from channels.routing import get_default_application

# from django.core.asgi import get_asgi_application
settings_module = "gitupper_proj.production" if 'WEBSITE_HOSTNAME' in os.environ else 'gitupper_proj.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      settings_module)

# application = get_asgi_application()

django.setup()
application = get_default_application()
