from django.urls import path
from livechat.views.conversation_view import ConversationView
from livechat.views.message_view import MessageView
from livechat.views.blacklist_view import BlacklistView
from livechat.views.notification_view import NotificationView

urlpatterns = [
    path('<int:user_id>/conversations/', ConversationView.as_view()),
    path('<int:user_id>/conversation/<int:conversation_id>/messages/', MessageView.as_view()),
    path('notification/', NotificationView.as_view()),
    path('<int:user_id>/blacklist/', BlacklistView.as_view()),
    path('<int:user_id>/blacklist/<int:target_id>', BlacklistView.as_view())
]