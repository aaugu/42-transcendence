from django.urls import re_path
from channels.routing import ProtocolTypeRouter,URLRouter,ChannelNameRouter
from django.urls import path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/livechat/conversation/(?P<conversation_id\w+)/$', consumers.LivechatConsumer.as_asgi()),
]