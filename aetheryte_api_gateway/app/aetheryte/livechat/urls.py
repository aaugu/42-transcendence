from django.urls import path
from livechat.views import ConversationView, MessageView, BlacklistView

urlpatterns = [
    path('<int:pk>/conversations/', ConversationView.as_view()),
    path('conversation/<int:pk>/messages/', MessageView.as_view()),
    path('<int:pk>/blacklist/', BlacklistView.as_view()),
    path('<int:pk>/blacklist/<int:target>', BlacklistView.as_view())
]