from django.urls import path
from .views import (
    pong_view,
    game_state,
    game_points,
    game_start,
    game_stop,
    game_reset,
    right_controller,
    left_controller,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("pong/", pong_view, name="pong"),
    # API ENDPOINTS
    path("api/game_state", game_state),
    path("api/game_points", game_points),
    path("api/game_start", game_start),
    path("api/game_stop", game_stop),
    path("api/game_reset", game_reset),
    path("api/game_points", game_points),
    path("api/right_controller", right_controller),
    path("api/left_controller", left_controller),
    # path('api/pong/change_controllers', pong_change_controllers),
]
