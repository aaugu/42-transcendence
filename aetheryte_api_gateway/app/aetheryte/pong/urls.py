from django.urls import path
from . import views

urlpatterns = [
    path("create-game/<creator_id>/<mode>/<joiner_id>/", views.create_game, name='create_game'),
    path("create-game-tournament/<player_one_id>/<player_two_id>/<mode>/", views.create_game_tournament, name='create_game_tournament'),
    path("create-game-remote/<player_one_id>/<player_two_id>/<mode>/", views.create_game_remote, name='create_game_remote'),
    path("end-game/", views.end_game, name='end_game'),
    path("get-user-games/<user_id>/", views.get_user_games, name='get_user_games'),
]