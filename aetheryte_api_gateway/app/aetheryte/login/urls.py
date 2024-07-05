from django.urls import path
from .views import CustomTokenObtainPairView, Verify2FACodeView, Enable2FAView

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/verify-2fa/', Verify2FACodeView.as_view(), name='verify_2fa_code'),
	path('token/enable-2fa/', Enable2FAView.as_view(), name='enable-2fa'),
]
