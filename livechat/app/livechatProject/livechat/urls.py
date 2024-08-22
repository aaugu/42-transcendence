from django.urls import path
from livechat.views import *

urlpatterns = [
    path('conversations/<int:pk>/', conversationViewSet),
    path('conversation/<int:pk>/', messageViewSet),
]