from django.urls import path
from livechat.consumers import ChatConsumer

websocket_urlpatterns = [
    path("wss/chat/<str:conversation_id>/", ChatConsumer.as_asgi()),
]