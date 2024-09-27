from django.shortcuts import render, redirect
# from django.views.decorators.csrf import csrf_protect, csrf_exempt
from .game.game import *
from django.http import JsonResponse
from .services import GameService
from .models import Games
import json
from .game.constants import PARAMS
from .services import GameAlreadyFinishedException

def join_game(request, joiner_id, game_id):
    print(f'Received request to join game with: {joiner_id} and joiner_id: {game_id}')

    if not joiner_id or not game_id:
      return JsonResponse({"error": "Missing required parameters"}, status=400)

    GameService.join_game(joiner_id=joiner_id, game_id=game_id)

    curr_game = GameService.get_game(game_id=game_id).to_dict()

    return JsonResponse(curr_game)


def create_game(request, creator_id, mode, joiner_id):
    print(f'Received request to create game with creator_id: {creator_id} and mode: {mode}')

    # Vérification des paramètres
    if not creator_id or not mode:
        return JsonResponse({"error": "Missing required parameters"}, status=400)

    try:
        mode = GameMode[mode.upper()]
    except KeyError:
        return JsonResponse({"error": "Invalid game mode"}, status=400)

    # Création du jeu via un service (hypothétique)
    game = GameService.create_game(creator_id, mode, joiner_id)

    return JsonResponse(game.to_dict())

def create_game_tournament(request, player_one_id, player_two_id, mode):
    print(f'Received request to create tournament game with player_one_id: {player_one_id}, player_two_id: {player_two_id} and mode: {mode}')

    # Vérification des paramètres
    if not player_one_id or not player_two_id or not mode:
        return JsonResponse({"error": "Missing required parameters"}, status=400)

    try:
        mode = GameMode[mode.upper()]
    except KeyError:
        return JsonResponse({"error": "Invalid game mode"}, status=400)

    # Création du jeu via un service (hypothétique)
    game = GameService.create_game_tournament(player_one_id, player_two_id, mode)

    return JsonResponse(game.to_dict())

# @csrf_exempt
def end_game(request):
    print(f'Received request to end game')

    # if not request.POST:
    #     return JsonResponse({"error": "Missing required parameters"}, status=400)

    try:
        data = GameService.end_game(request)
        return JsonResponse({"message": "Game ended", "data": data})
    except GameAlreadyFinishedException as e:
        return JsonResponse({"error": str(e)}, status=409)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_user_games(request, user_id):
    print(f'Received request to get games for user: {user_id}')

    games = GameService.get_user_games(user_id=user_id)
    datas = [game.to_dict() for game in games]
    if len(datas) > 0:
        'No entries in the db'
    else:
        'Entries in the db'

    return JsonResponse(datas, safe=False)

def get_game(request, game_id):
    print(f'Received request to get game with id: {game_id}')

    game = GameService.get_game(game_id=game_id)
    if not game:
        return JsonResponse({"error": "Game not found"}, status=404)

    return JsonResponse(game.to_dict())

def get_pong_constants(request):
    print(f'Received request to get pong constants')

    return JsonResponse(PARAMS)
