from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    CustomTokenObtainPairView,
    general_user,
    detail_user  
    )

urlpatterns = [
	path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]