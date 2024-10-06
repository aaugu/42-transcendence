import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import logging

from login.models import CustomUser
from login.serializers import *
from login.utils import check_authentication, check_user_jwt_vs_user_url, get_user_from_jwt
from django.http import QueryDict

PONG_SERVICE_URL = "http://172.20.3.2:9000"

logger = logging.getLogger(__name__)

def create_game(request, creator_id, mode, joiner_id):
  if not check_authentication(request):
    return JsonResponse({'detail': 'Unauthorized'}, status=401)
  if not check_user_jwt_vs_user_url(request, int(creator_id)):
    return JsonResponse({'detail': 'Unauthorized'}, status=403)
  response = requests.get(
    f"{PONG_SERVICE_URL}/create-game/{creator_id}/{mode}/{joiner_id}/"
  )
  return JsonResponse(response.json(), status=response.status_code)


def create_game_tournament(request, player_one_id, player_two_id, mode):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    if not check_user_jwt_vs_user_url(request, int(player_one_id)):
        return JsonResponse({'detail': 'Unauthorized'}, status=403)
    response = requests.get(
        f"{PONG_SERVICE_URL}/create-game-tournament/{player_one_id}/{player_two_id}/{mode}/"
    )
    return JsonResponse(response.json(), status=response.status_code)

def create_game_remote(request, player_one_id, player_two_id, mode):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    if not check_user_jwt_vs_user_url(request, int(player_one_id)):
        return JsonResponse({'detail': 'Unauthorized'}, status=403)
    response = requests.get(
        f"{PONG_SERVICE_URL}/create-game-remote/{player_one_id}/{player_two_id}/{mode}/"
    )
    return JsonResponse(response.json(), status=response.status_code)

@csrf_exempt
def end_game(request):
    if not check_authentication(request):
        print("Authentication check failed")
        return JsonResponse({'detail': 'Unauthorized'}, status=401)
    print("Authentication check passed")

    # Decode the JWT token and get the user ID
    user_id = get_user_from_jwt(request)
    print(f"User ID from JWT: {user_id}")

    # Extract winner_id and loser_id from the request
    winner_id = int(request.POST.get('winner_id'))
    loser_id = int(request.POST.get('loser_id'))
    print(f"Winner ID: {winner_id}, Loser ID: {loser_id}")

    # Check if user_id matches winner_id or loser_id
    if user_id == winner_id or user_id == loser_id:
        print("User ID matches winner_id or loser_id")
    else:
        print("User ID does not match winner_id or loser_id")
        return JsonResponse({'detail': 'Unauthorized'}, status=403)

    response = requests.post(f"{PONG_SERVICE_URL}/end-game/", data=request.POST)
    if response.text:  # Check if the response is not empty
        print("Received response from PONG_SERVICE")
        return JsonResponse(response.json(), status=response.status_code)
    else:
        print("Empty response from PONG_SERVICE")
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

# def get_game(request, game_id):
#     if not check_authentication(request):
#         return JsonResponse({"detail": "Unauthorized"}, status=401)
#     response = requests.get(f"{PONG_SERVICE_URL}/get-game/{game_id}/")
#     return JsonResponse(response.json(), status=response.status_code)
