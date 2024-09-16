from django.urls import path, include

urlpatterns = [
	path('api/login/', include('login.urls')),
	path('api/user/', include('usermanager.urls')),
	path('api/livechat/', include('livechat.urls')),
 	path('api/pong/', include('pong.urls')),
  	path('api/tournament/', include('tournament.urls'))
]