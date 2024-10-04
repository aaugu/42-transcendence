from django.urls import path, re_path
from pong.consumers import ApiPongConsumer

pong_websocket_urlpatterns = [
    re_path(r'^ws/pong/(?P<game_id>[^/]+)/?$', ApiPongConsumer.as_asgi()),
]