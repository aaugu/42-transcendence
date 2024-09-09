from django.urls import path
from livechat.views.conversation_view import ConversationView
from livechat.views.message_view import MessageView
from livechat.views.blacklist_view import BlacklistView

urlpatterns = [
    path('<int:pk>/conversations/', ConversationView.as_view()),
    path('conversation/<int:pk>/messages/', MessageView.as_view()),
    path('<int:pk>/blacklist/', BlacklistView.as_view()),
    path('<int:pk>/blacklist/<int:target_id>', BlacklistView.as_view())
]