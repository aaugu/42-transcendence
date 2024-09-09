from django.urls import path
from . import views

urlpatterns = [
    path("create-game/<creator_id>/<mode>/", views.create_game, name='create_game'),
    path("join-game/<joiner_id>/<game_id>/", views.join_game, name='join_game'),
    path("retrieve_last_games/<user_id>/<nb_of_games>", views.retrieve_last_games, name='retrieve_last_games')
]