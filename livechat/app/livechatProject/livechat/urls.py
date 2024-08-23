from django.urls import path
from livechat.views import conversationViewSet, messageViewSet, blacklistViewSet

urlpatterns = [
    path('<int:pk>/conversations/', conversationViewSet),
    path('conversation/<int:pk>/messages/', messageViewSet),
    path('blacklists/', blacklistViewSet)
]