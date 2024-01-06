from django.urls import path

from .views import LoginTokenObtainPairView, RegisterView, RefreshTokenView, LogoutView

urlpatterns = [
    path('auth/login/', LoginTokenObtainPairView.as_view(), name='auth_login'),
    path('auth/token/refresh/', RefreshTokenView.as_view(),
         name='auth_token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
]
