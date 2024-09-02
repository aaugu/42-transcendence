from django.urls import path
from livechat.views.conversation_view import *
from livechat.views.message_view import *
from livechat.views.blacklist_view import *

urlpatterns = [
    path('<int:pk>/conversations/', ConversationView.as_view()),
    path('conversation/<int:pk>/messages/', MessageView.as_view()),
    path('blacklists/', blacklistViewSet)
]