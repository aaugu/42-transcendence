from django.urls import re_path
from .consumers.consumers import PongConsumer

websocket_urlpatterns = [
    # re_path(r'wsn/pong/(?P<game_id>.+)$', PongConsumer.as_asgi()),
    re_path(r'wsn/pong/(?P<game_id>[^/]+)', PongConsumer.as_asgi()),
]