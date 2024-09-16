"""
ASGI config for livechatProject project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter
from channels.auth import AuthMiddlewareStack
from livechat.routing import websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'livechatProject.settings')

# ASGI application configuration
application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # Pour gérer les requêtes HTTP classiques
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns  # Importation des routes WebSocket depuis routing.py
        )
    ),
})