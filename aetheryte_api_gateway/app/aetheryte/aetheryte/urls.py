from django.contrib import admin
from django.urls import path, include

urlpatterns = [
	path('api/login/', include('login.urls')),
	path('api/user/', include('usermanager.urls')),
]
