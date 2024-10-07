from django.shortcuts import render, redirect
from .game.game import *
from django.http import JsonResponse
from .services import GameService
from .models import Games
from .game.constants import PARAMS
from .services import GameAlreadyFinishedException
from django.views.decorators.csrf import csrf_exempt
import requests
import json

@csrf_exempt
def create_game(request, creator_id, mode, joiner_id):
    print("Received request to create game yeah!")

    notif_url = "http://172.20.5.2:8000/livechat/notification/"
    # Vérification des paramètres
    if not creator_id or not joiner_id or not mode:
        return JsonResponse({"error": "Missing required parameters"}, status=400)
    try:
        mode = GameMode[mode.upper()]
    except KeyError:
        return JsonResponse({"error": "Invalid game mode"}, status=400)

    game = GameService.create_game(creator_id, mode, joiner_id)

    # Parse the nicknames in the body of the request
    if request.body:
        body = json.loads(request.body)
        player1 = body.get('creator_nickname')
        player2 = body.get('joiner_nickname')
    else:
        player1 = None
        player2 = None

    print("In views microservice", player1, player2)

    if joiner_id != 0:
        print("Sending notification to joiner")
        json_request = {
            'user_1': {
                'user_id': creator_id,
                'message': f'You have invited `{player2}` to play a local game.'
            },
            'user_2': {
                'user_id': joiner_id,
                'message': f'{player1} invites you to play a local game on their computer, go join them.'
            },
        }
        response = requests.post(notif_url, json=json_request)
        if response.status_code != 201:
            return JsonResponse({"error": "Failed to send notification"}, status=500)
        else:
            print("Notification sent successfully")

    return JsonResponse(game.to_dict())

@csrf_exempt
def create_game_tournament(request, player_one_id, player_two_id, mode):
    # Vérification des paramètres
    if not player_one_id or not player_two_id or not mode:
        return JsonResponse({"error": "Missing required parameters"}, status=400)
    try:
        mode = GameMode[mode.upper()]
    except KeyError:
        return JsonResponse({"error": "Invalid game mode"}, status=400)

    game = GameService.create_game_tournament(player_one_id, player_two_id, mode)

    return JsonResponse(game.to_dict())

@csrf_exempt
def create_game_remote(request, player_one_id, player_two_id, mode):
    notif_url = "http://172.20.5.2:8000/livechat/notification/"
    # Vérification des paramètres
    if not player_one_id or not player_two_id or not mode:
        return JsonResponse({"error": "Missing required parameters"}, status=400)

    try:
        mode = GameMode[mode.upper()]
    except KeyError:
        return JsonResponse({"error": "Invalid game mode"}, status=400)

    game = GameService.create_game_remote(player_one_id, player_two_id, mode)
    game_id = game.game_id

    # Parse the nicknames in the body of the request
    if request.body:
        body = json.loads(request.body)
        player1 = body.get('creator_nickname')
        player2 = body.get('joiner_nickname')
    else: 
        player1 = None
        player2 = None

    button = f'<button id="chat-invite-game-link" data-gameid="{game_id}" data-senderid="{player_one_id}" data-receiverid="{player_two_id}" class="btn btn-primary">Join the game</button>'
    
    json_request = {
        'user_1': {
            'user_id': player_one_id,
            'message': f'Your match against `{player2}` is ready, click here to join. {button}'
        },
        'user_2': {
            'user_id': player_two_id,
            'message': f'Your match against `{player1}` is ready, click here to join. {button}'
        },
    }

    response = requests.post(notif_url, json=json_request)
    if response.status_code != 201:
        return JsonResponse({"error": "Failed to send notification"}, status=500)

    return JsonResponse(game.to_dict())

@csrf_exempt
def end_game(request):
    try:
        data = GameService.end_game(request)
        return JsonResponse({"message": "Game ended", "data": data})
    except GameAlreadyFinishedException as e:
        return JsonResponse({"error": str(e)}, status=409)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

def get_user_games(request, user_id):
    games = GameService.get_user_games(user_id=user_id)
    datas = [game.to_dict() for game in games]
    if len(datas) > 0:
        'No entries in the db'
    else:
        'Entries in the db'

    return JsonResponse(datas, safe=False)

def get_game_data(request, game_id):
    game = GameService.get_game(game_id)
    return JsonResponse(game.to_dict())