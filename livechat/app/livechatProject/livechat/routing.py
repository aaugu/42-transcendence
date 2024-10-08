from django.urls import path
from livechat.consumers import ChatConsumer

websocket_urlpatterns = [
    path(r'ws/chat/<int:conversation_id>', ChatConsumer.as_asgi()),
]