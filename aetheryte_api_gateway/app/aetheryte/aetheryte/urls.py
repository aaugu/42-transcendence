from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
	path('api/login/', include('login.urls')),
	path('api/user/', include('usermanager.urls')),
	path('livechat/', include('livechat.urls')),
]
