import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from login.models import CustomUser
from login.serializers import *
from login.utils import check_authentication, check_user_jwt_vs_user_url, get_user_from_jwt
from livechat.views.utils import user_valid

PONG_SERVICE_URL = "http://172.20.3.2:9000"

@csrf_exempt
def create_game(request, creator_id, mode, joiner_id):
  if not check_authentication(request):
    return JsonResponse({'detail': 'Unauthorized'}, status=401)
  if not check_user_jwt_vs_user_url(request, int(creator_id)):
    return JsonResponse({'detail': 'Unauthorized'}, status=403)
  if not user_valid(creator_id) or (int(joiner_id) != 0 and not user_valid(joiner_id)):
    return JsonResponse({'detail': 'User not found'}, status=404)
  if creator_id == joiner_id:
    return JsonResponse({'detail': 'Cannot play against yourself'}, status=404)

  # Add in the body of request the nickname of creator and joiner
  creator_nickname = CustomUser.objects.get(id=creator_id).nickname
  

  if int(joiner_id) == 0:
    joiner_nickname = ""
  else:
    joiner_nickname = CustomUser.objects.get(id=joiner_id).nickname

  try:
    response = requests.post(
        f"{PONG_SERVICE_URL}/create-game/{creator_id}/{mode}/{joiner_id}/",
        json={
          'creator_nickname': creator_nickname,
          'joiner_nickname': joiner_nickname
        }
      )
  except requests.exceptions.RequestException as e:
    return JsonResponse({'detail': 'Failed to create game due to service error.'}, status=503)

  return JsonResponse(response.json(), status=201)

@csrf_exempt
def create_game_tournament(request, player_one_id, player_two_id, mode):
  if not check_authentication(request):
    return JsonResponse({'detail': 'Unauthorized'}, status=401)
  if not user_valid(player_one_id) or not user_valid(player_two_id):
    return JsonResponse({'detail': 'User not found'}, status=404)
  if player_one_id == player_two_id:
    return JsonResponse({'detail': 'Cannot play against yourself'}, status=404)
  response = requests.post(
    f"{PONG_SERVICE_URL}/create-game-tournament/{player_one_id}/{player_two_id}/{mode}/"
  )

  return JsonResponse(response.json(), status=201)


@csrf_exempt
def create_game_remote(request, player_one_id, player_two_id, mode):
  if not check_authentication(request):
    return JsonResponse({'detail': 'Unauthorized'}, status=401)
  if not check_user_jwt_vs_user_url(request, int(player_one_id)):
    return JsonResponse({'detail': 'Unauthorized'}, status=403)
  if not user_valid(player_one_id) or not user_valid(player_two_id):
    return JsonResponse({'detail': 'User not found'}, status=404)
  if player_one_id == player_two_id:
    return JsonResponse({'detail': 'Cannot play against yourself'}, status=404)

  creator_nickname = CustomUser.objects.get(id=player_one_id).nickname
  joiner_nickname = CustomUser.objects.get(id=player_two_id).nickname

  response = requests.post(
    f"{PONG_SERVICE_URL}/create-game-remote/{player_one_id}/{player_two_id}/{mode}/",
    json={
      'creator_nickname': creator_nickname,
      'joiner_nickname': joiner_nickname
    }
  )

  return JsonResponse(response.json(), status=201)

@csrf_exempt
def end_game(request):
    if not check_authentication(request):
        return JsonResponse({'detail': 'Unauthorized'}, status=401)

    # Decode the JWT token and get the user ID
    user_id = get_user_from_jwt(request)

    # Extract winner_id and loser_id from the request
    winner_id = int(request.POST.get('winner_id'))
    loser_id = int(request.POST.get('loser_id'))

    game_id = request.POST.get('game_id')
    response = requests.get(f"{PONG_SERVICE_URL}/get-game-data/{game_id}/")
    mode = response.json().get('mode')

    if mode != 'TOURNAMENT' and not (user_id == winner_id or user_id == loser_id):
        return JsonResponse({'detail': 'Unauthorized'}, status=403)

    response = requests.post(f"{PONG_SERVICE_URL}/end-game/", data=request.POST)
    if response.text:  # Check if the response is not empty
        return JsonResponse(response.json(), status=201)
    else:
        return JsonResponse({"error": "Empty response"}, status=400)


def get_user_games(request, user_id):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    if not user_valid(user_id):
        return JsonResponse({'detail': 'User not found'}, status=404)
    # if not check_user_jwt_vs_user_url(request, int(user_id)):
    #     return JsonResponse({'detail': 'Unauthorized'}, status=403)
    response = requests.get(f"{PONG_SERVICE_URL}/get_user_games/{user_id}/")
    games = response.json()

    for game in games:
        if game["winner_id"] is not None:
            if game["winner_id"] == 0:
                game["winner_id"] = "Guest"
            else:
                try:
                    game["winner_id"] = CustomUser.objects.get(
                        id=game["winner_id"]
                    ).nickname
                except CustomUser.DoesNotExist:
                    game["winner_id"] = "Unknown user"
        if game["loser_id"] is not None:
            if game["loser_id"] == 0:
                game["loser_id"] = "Guest"
            else:
                try:
                    game["loser_id"] = CustomUser.objects.get(
                        id=game["loser_id"]
                    ).nickname
                except CustomUser.DoesNotExist:
                    game["loser_id"] = "Unknown user"
    return JsonResponse(games, safe=False, status=response.status_code)
