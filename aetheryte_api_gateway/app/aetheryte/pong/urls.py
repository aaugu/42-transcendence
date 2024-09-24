from django.urls import path
from . import views

urlpatterns = [
    path("create-game/<creator_id>/<mode>/", views.create_game, name='create_game'),
    path("create-game-tournament/<player_one_id>/<player_two_id>/<mode>/", views.create_game_tournament, name='create_game_tournament'),
    path("join-game/<game_id>/<joiner_id>/", views.join_game, name='join_game'),
    path("end-game/", views.end_game, name='end_game'),
    path("retrieve_last_games/<user_id>/<nb_of_games>", views.retrieve_last_games, name='retrieve_last_games'),
    path("get-game/<game_id>/", views.get_game, name='get_game'),
]