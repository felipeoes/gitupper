from django.urls import path

from rest_framework_simplejwt.views import (TokenRefreshView, )

from .views import LoginTokenObtainPairView, RegisterView

urlpatterns = [
    path('auth/login/', LoginTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(),
         name='auth_token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
]
