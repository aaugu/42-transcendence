from django.urls import path
from livechat.consumers import ChatConsumer

websocket_urlpatterns = [
    # path(r'ws/chat/(?P<conversation_id>[^/])$', ChatConsumer.as_asgi()),
    path(r'ws/chat/', ChatConsumer.as_asgi()),
    # path(r'ws/chat/(?P<conversation_id>[^/])$', ChatConsumer.as_asgi()),
]