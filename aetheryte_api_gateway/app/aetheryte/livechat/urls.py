from django.urls import path
from livechat.views import conversationViewSet, messageViewSet

urlpatterns = [
    path('<int:pk>/conversations/', conversationViewSet),
    path('conversation/<int:pk>/messages/', messageViewSet),
    # path('blacklists/', blacklistViewSet)
]