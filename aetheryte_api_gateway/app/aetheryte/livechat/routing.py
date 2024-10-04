from django.urls import path
from livechat.consumers import ApiChatConsumer

chat_websocket_urlpatterns = [
    path(r'ws/chat/<int:conversation_id>', ApiChatConsumer.as_asgi()),
]