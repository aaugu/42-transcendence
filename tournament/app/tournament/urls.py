"""
URL configuration for tournament project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from microservice.views import (GenerateMatchesView, StartMatchView, EndMatchView, TournamentView, TournamentPlayersView, StartTournamentView,ManageTournamentView, TournamentlocalView, DeleteInactiveTournamentView, MyTournamentAsPlayerView, MyTournamentAsAdminView)

urlpatterns = [
    path('tournament/remote/', TournamentView.as_view(), name='new_tournament'),
    path('tournament/local/', TournamentlocalView.as_view(), name='new_tournament_local'),
    path('tournament/<int:tournament_id>/', ManageTournamentView.as_view(), name='manage_tournament'),  
    path('tournament/<int:tournament_id>/players/', TournamentPlayersView.as_view(), name='tournament_players'),
    path('tournament/<int:tournament_id>/start/', StartTournamentView.as_view(), name='start_tournament'),
    path('tournament/<int:tournament_id>/matches/generate/', GenerateMatchesView.as_view(), name='generate_matches'),
    path('tournament/<int:tournament_id>/match/start/', StartMatchView.as_view(), name='start_match'),
    path('tournament/<int:tournament_id>/match/end/', EndMatchView.as_view(), name='end_match'),
    path('tournament/<int:user_id>/mytournament/player/', MyTournamentAsPlayerView.as_view(), name='tournament_as_player'),
    path('tournament/<int:user_id>/mytournament/admin/', MyTournamentAsAdminView.as_view(), name='tournament_as_admin'),
    path('tournament/delete_inactive/', DeleteInactiveTournamentView.as_view(), name='delete_inactive_tournament')
]

# TournamentView:
#     -get    : optention de la liste des tournois avec les inforamations ralatives 
#                 'id', 'name', 'max_players', 'nb_players', 'is_private', 'status','admin-id'
#     -post   : creer un tounoi et enregistre l'admin en joueur
#     -delete : suprime tout les tournois(CREATED) d'un utilisateur

# TournamentlocalView:
#     -post   : creer un tounoi et enregistre la liste des joueurs 
#           (PS : pour get et delete utiliser TournamentView)

# ManageTournamentView:
#     -get    : optention des informations relative a un tournoi avec la liste de joueur 
#                 'id', 'name', 'max_players', 'nb_players', 'is_private', 'status','admin-id' + 'players'('nickname','user_id')
#     -delete : suprime un tournoi si l'admin est le demandeur et qu'il n'est pas IN_PROGRESS
#     -patch  : modifie des informations de creation de tournois (name, player, private, password)

# TournamentPlayersView:
#     -get    : optention de la liste des joueurs 'players'('nickname','user_id') avec 'max_players' et 'nb_players'
#     -post   : ajoute un joueur a un tournois
#     -delete : suprime un joueur d'un tournois (cas d'un joueur quitant le tournois par lui-meme)

# StartTournamentView:
#     -patch  : modifie le status d'un tournois et set le start time

# GenerateMatchesView:
#     -get    : optention de la liste des matches du tournoi
#     -post   : genere l'ordre des matchs d'un tournoi

# StartMatchView:
#     -post   : modifie le status d'un matche en IN_PROGRESS

# EndMatchView:
#     -post   : set le "winner", modifie le status d'un matche en FINISHED et update le tournoi. Si c'est la final (calcule interne) set le tournois en FINISHED

# DeleteInactiveTournamentView:
#     -delete : suprime tout les tournois(IN_PROGRESS) plus vieux que 1h