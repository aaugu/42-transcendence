from django.urls import path
from livechat.views import ConversationView, MessageView

urlpatterns = [
    path('<int:pk>/conversations/', ConversationView.as_view()),
    path('conversation/<int:pk>/messages/', MessageView.as_view()),
    # path('blacklists/', blacklistViewSet)
]