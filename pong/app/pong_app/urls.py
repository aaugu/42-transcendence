from django.urls import path
from .views import (
    pong_view,
    create_game,
    join_game,
    retrieve_last_games
    # game_state,
    # game_points,
    # game_start,
    # game_stop,
    # game_reset,
    # right_controller,
    # left_controller,
    # move_right_paddle,
    # move_left_paddle,
)

urlpatterns = [
    path("pong/", pong_view, name="pong"),
    path("create-game/<creator_id>/<mode>/", create_game, name='create_game'),
    # path("create-game/", create_game, name='create_game'),
    path("end-game/", pong_view, name='end_game'),
    path("join-game/<joiner_id>/<game_id>/", join_game, name='join_game'),
    path("retrieve_last_games/<user_id>/<nb_of_games>", retrieve_last_games, name='retrieve_last_games')
    # API ENDPOINTS
    # path("api/game_state", game_state),
    # path("api/game_points", game_points),
    # path("api/game_start", game_start),
    # path("api/game_stop", game_stop),
    # path("api/game_reset", game_reset),
    # path("api/game_points", game_points),
    # path("api/right_controller", right_controller),
    # path("api/left_controller", left_controller),
    # path('api/move_right_paddle', move_right_paddle),
    # path('api/move_left_paddle', move_left_paddle),
]
