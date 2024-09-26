from django.urls import path
from .views import (
    pong_view,
    create_game,
    create_game_tournament,
    end_game,
    join_game,
    get_user_games,
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
    path("create-game/<creator_id>/<mode>/<joiner_id>/", create_game, name='create_game'),
    path("create-game-tournament/<player_one_id>/<player_two_id>/<mode>/", create_game_tournament, name='create_game_tournament'),
    path("end-game/", end_game, name='end_game'),
    path("join-game/<joiner_id>/<game_id>/", join_game, name='join_game'),
    path("get_user_games/<user_id>/", get_user_games, name='get_user_games'),
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
