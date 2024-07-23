from django.urls import path
from .views import pong_view, pong_state

urlpatterns = [
    path('pong/', pong_view, name='pong'),
    path('api/pong_state', pong_state),
]