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
from microservice.views import (GenerateMatchesView, StartMatchView, EndMatchView, TournamentView, TournamentPlayersView, StartTournamentView, TournamentlocalView, DeleteInactiveTournamentView)

urlpatterns = [
    path('tournament/remote/', TournamentView.as_view(), name='new_tournament'),
    path('tournament/local/', TournamentlocalView.as_view(), name='new_tournament_local'),  
    path('<int:tournament_id>/players/', TournamentPlayersView.as_view(), name='tournament_players'),
    path('<int:tournament_id>/start/', StartTournamentView.as_view(), name='start_tournament'),
    path('<int:tournament_id>/matches/generate/', GenerateMatchesView.as_view(), name='generate_matches'),
    path('<int:tournament_id>/match/start/', StartMatchView.as_view(), name='start_match'),
    path('<int:tournament_id>/match/end/', EndMatchView.as_view(), name='end_match'),
    path('delete_inactive/', DeleteInactiveTournamentView.as_view(), name='delete_inactive_tournament')
]
