from django.urls import path
from rest_framework_simplejwt.views import     TokenObtainPairView, TokenRefreshView

from .views import SignUpAPIView, SignInAPIView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('signup/', SignUpAPIView.as_view(), name='signup'),
    path('signin/', SignInAPIView.as_view(), name='signin'),
]
