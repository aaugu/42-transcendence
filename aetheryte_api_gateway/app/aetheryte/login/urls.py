from django.urls import path
from .views import CustomTokenObtainPairView, Verify2FACodeView, UpdateUser

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/verify-2fa/', Verify2FACodeView.as_view(), name='verify_2fa_code'),
	path('token/test/', UpdateUser.as_view(), name="update_2fa_user_parameters")
]
