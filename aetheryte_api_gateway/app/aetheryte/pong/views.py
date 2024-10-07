import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from login.models import CustomUser
from login.serializers import *
from login.utils import check_authentication, check_user_jwt_vs_user_url, get_user_from_jwt

PONG_SERVICE_URL = "http://172.20.3.2:9000"

@csrf_exempt
def create_game(request, creator_id, mode, joiner_id):
  if not check_authentication(request):
    return JsonResponse({'detail': 'Unauthorized'}, status=401)
  if not check_user_jwt_vs_user_url(request, int(creator_id)):
    return JsonResponse({'detail': 'Unauthorized'}, status=403)
  
  # Add in the body of request the nickname of creator and joiner
  creator_nickname = CustomUser.objects.get(id=creator_id).nickname
  joiner_nickname = CustomUser.objects.get(id=joiner_id).nickname
  
  response = requests.post(
    f"{PONG_SERVICE_URL}/create-game/{creator_id}/{mode}/{joiner_id}/",
    data={
      'creator_nickname': creator_nickname,
      'joiner_nickname': joiner_nickname
    }
  )

  return JsonResponse(response.json(), status=response.status_code)

@csrf_exempt
def create_game_tournament(request, player_one_id, player_two_id, mode):
  if not check_authentication(request):
    return JsonResponse({'detail': 'Unauthorized'}, status=401)
  if not check_user_jwt_vs_user_url(request, int(player_one_id)):
    return JsonResponse({'detail': 'Unauthorized'}, status=403)
  response = requests.post(
    f"{PONG_SERVICE_URL}/create-game-tournament/{player_one_id}/{player_two_id}/{mode}/"
  )
  return JsonResponse(response.json(), status=response.status_code)

@csrf_exempt
def create_game_remote(request, player_one_id, player_two_id, mode):
  if not check_authentication(request):
    return JsonResponse({'detail': 'Unauthorized'}, status=401)
  if not check_user_jwt_vs_user_url(request, int(player_one_id)):
    return JsonResponse({'detail': 'Unauthorized'}, status=403)

  creator_nickname = CustomUser.objects.get(id=player_one_id).nickname
  joiner_nickname = CustomUser.objects.get(id=player_two_id).nickname

  response = requests.post(
    f"{PONG_SERVICE_URL}/create-game-remote/{player_one_id}/{player_two_id}/{mode}/",
    data={
      'creator_nickname': creator_nickname,
      'joiner_nickname': joiner_nickname
    }
  )
  return JsonResponse(response.json(), status=response.status_code)

@csrf_exempt
def end_game(request):
    if not check_authentication(request):
        return JsonResponse({'detail': 'Unauthorized'}, status=401)

    # Decode the JWT token and get the user ID
    user_id = get_user_from_jwt(request)

    # Extract winner_id and loser_id from the request
    winner_id = int(request.POST.get('winner_id'))
    loser_id = int(request.POST.get('loser_id'))

    if not (user_id == winner_id or user_id == loser_id):
        return JsonResponse({'detail': 'Unauthorized'}, status=403)

    response = requests.post(f"{PONG_SERVICE_URL}/end-game/", data=request.POST)
    if response.text:  # Check if the response is not empty
        return JsonResponse(response.json(), status=response.status_code)
    else:
        return JsonResponse({"error": "Empty response"}, status=400)

def get_user_games(request, user_id):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    if not check_user_jwt_vs_user_url(request, int(user_id)):
        return JsonResponse({'detail': 'Unauthorized'}, status=403)
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

def get_game(request, game_id):
    print("GET GAME")
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    print("CHECK AUTH")
    response = requests.get(f"{PONG_SERVICE_URL}/get_game/{game_id}/")
    return JsonResponse(response.json(), status=response.status_code)
