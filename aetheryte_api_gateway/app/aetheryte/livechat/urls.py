from django.urls import path
from livechat.views.conversation_view import ConversationView
from livechat.views.message_view import MessageView
from livechat.views.blacklist_view import BlacklistView

urlpatterns = [
    path('<int:user_id>/conversations/', ConversationView.as_view()),
    path('<int:user_id>/conversation/<int:conversation_id>/messages/', MessageView.as_view()),
    path('<int:user_id>/blacklist/', BlacklistView.as_view()),
    path('<int:user_id>/blacklist/<int:target>', BlacklistView.as_view())
]