from .settings import *
import os


hosts = ["https://gitupper-frontend.vercel.app",
         "https://api-gitupper.azurewebsites.net", os.environ['WEBSITE_HOSTNAME']]
ALLOWED_HOSTS = hosts if 'WEBSITE_HOSTNAME' in os.environ else []

DEBUG = False


CORS_ALLOWED_ORIGINS = [
    "https://gitupper-frontend.vercel.app",
    "https://api-gitupper.azurewebsites.net"
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': os.environ['DB_HOST'],
        'PORT': os.environ.get('DB_PORT', 5432),
        'NAME': os.environ['DB_NAME'],
        'USER': os.environ['DB_USER'],
        'PASSWORD': os.environ['DB_PASSWORD'],
    }
}

# Disable Browsable API
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    )
}

# AZURE STORAGE

DEFAULT_FILE_STORAGE = 'gitupper_proj.backends.AzureMediaStorage'
STATICFILES_STORAGE = 'gitupper_proj.backends.AzureStaticStorage'

AZURE_STORAGE_KEY = os.environ.get('AZURE_STORAGE_KEY', False)
AZURE_ACCOUNT_NAME = "storagegitupper"
AZURE_MEDIA_CONTAINER = os.environ.get('AZURE_MEDIA_CONTAINER', 'media')
AZURE_STATIC_CONTAINER = os.environ.get('AZURE_STATIC_CONTAINER', 'static')

# AZURE_CUSTOM_DOMAIN = f'{AZURE_ACCOUNT_NAME}.azureedge.net'  # CDN URL
# Files URL
AZURE_CUSTOM_DOMAIN = f'{AZURE_ACCOUNT_NAME}.blob.core.windows.net'

STATIC_URL = f'https://{AZURE_CUSTOM_DOMAIN}/{AZURE_STATIC_CONTAINER}/'
MEDIA_URL = f'https://{AZURE_CUSTOM_DOMAIN}/{AZURE_MEDIA_CONTAINER}/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
# any static paths you want to publish
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'files', 'static')
]
