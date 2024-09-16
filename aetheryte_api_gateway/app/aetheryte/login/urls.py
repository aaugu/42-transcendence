from django.urls import path
from .views import *

urlpatterns = [
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('token/logout/<int:user_id>',logout_user.as_view(), name='logout user'),
    path('token/verify-2fa/', Verify2FACodeView.as_view(), name='verify_2fa_code'),
]
