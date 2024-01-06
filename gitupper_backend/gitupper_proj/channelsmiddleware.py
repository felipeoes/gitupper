from django.db import close_old_connections
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from jwt import decode as jwt_decode
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async


class TokenAuthMiddleware:
    """
    Custom token auth middleware
    """

    def __init__(self, inner):
        # Store the ASGI application we were passed
        self.inner = inner

    async def __call__(self, scope, receive, send):

        # Close old database connections to prevent usage of timed out connections
        close_old_connections()

        # Get the token from Authorization header
        auth_header = [header[1] for header in scope['headers']
                       if b'authorization' in header[0]]
        if len(auth_header) == 0:
            return None

        token = auth_header[0].decode('utf-8').split(' ')[1]

        # Try to authenticate the user
        try:
            # This will automatically validate the token and raise an error if token is invalid
            UntypedToken(token)
        except (InvalidToken, TokenError) as e:
            # Token is invalid
            print(e)
            return None
        else:
            #  Then token is valid, decode it
            decoded_data = jwt_decode(
                token, settings.SECRET_KEY, algorithms=["HS256"])

            # Get the user using ID
            user = await database_sync_to_async(get_user_model().objects.get)(
                gitupper_id=decoded_data["user_gitupper_id"])

            # Add the user to the scope
            scope['user'] = user

        # Return the inner application directly and let it run everything else
        return await self.inner(dict(scope, user=user), receive, send)
