from django.urls import path
from .views import (
    create_game,
    create_game_tournament,
    create_game_remote,
    end_game,
    get_user_games,
    get_game_data,
)

urlpatterns = [
    path("create-game/<creator_id>/<mode>/<joiner_id>/", create_game, name='create_game'),
    path("create-game-tournament/<player_one_id>/<player_two_id>/<mode>/", create_game_tournament, name='create_game_tournament'),
    path("create-game-remote/<player_one_id>/<player_two_id>/<mode>/", create_game_remote, name='create_game_remote'),
    path("end-game/", end_game, name='end_game'),
    path("get_user_games/<user_id>/", get_user_games, name='get_user_games'),
    path("get-game-data/<game_id>/", get_game_data, name='get_game_data'),
]
