from django.urls import path
from livechat.views import *

urlpatterns = [
    path('<int:pk>/conversations/', conversationViewSet),
    path('conversation/<int:pk>/messages/', messageViewSet),
]