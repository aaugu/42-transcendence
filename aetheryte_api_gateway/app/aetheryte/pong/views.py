import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from login.models import CustomUser
from login.serializers import *
from usermanager.utils import check_authentication

PONG_SERVICE_URL = "http://172.20.3.2:9000"

def create_game(request, creator_id, mode):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    response = requests.get(f"{PONG_SERVICE_URL}/create-game/{creator_id}/{mode}/")
    return JsonResponse(response.json(), status=response.status_code)

def create_game_tournament(request, player_one_id, player_two_id, mode):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    response = requests.get(f"{PONG_SERVICE_URL}/create-game-tournament/{player_one_id}/{player_two_id}/{mode}/")
    return JsonResponse(response.json(), status=response.status_code)

def join_game(request, joiner_id, game_id):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    response = requests.get(f"{PONG_SERVICE_URL}/join-game/{joiner_id}/{game_id}/")
    return JsonResponse(response.json(), status=response.status_code)

@csrf_exempt
def end_game(request):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    response = requests.post(f"{PONG_SERVICE_URL}/end-game/", data=request.POST)
    if response.text:  # Check if the response is not empty
        return JsonResponse(response.json(), status=response.status_code)
    else:
        return JsonResponse({"error": "Empty response"}, status=400)

# def get_user_games(request, user_id):
#     if not check_authentication(request):
#       return JsonResponse({'detail': 'Unauthorized'}, status=401)
#     response = requests.get(f"{PONG_SERVICE_URL}/get_user_games/{user_id}/")
#     for game in response.json():
#         game['winner_id'] = CustomUser.objects.get(id=game['winner_id']).username
#         game['loser_id'] = CustomUser.objects.get(id=game['loser_id']).username
#     return JsonResponse(response.json(), safe=False, status=response.status_code)

def get_user_games(request, user_id):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    response = requests.get(f"{PONG_SERVICE_URL}/get_user_games/{user_id}/")
    games = response.json()
    for game in games:
        if game['winner_id'] is not None:
            try:
                game['winner_id'] = CustomUser.objects.get(id=game['winner_id']).username
            except CustomUser.DoesNotExist:
                game['winner_id'] = 'Unknown user'
        if game['loser_id'] is not None:
            try:
                game['loser_id'] = CustomUser.objects.get(id=game['loser_id']).username
            except CustomUser.DoesNotExist:
                game['loser_id'] = 'Unknown user'
    return JsonResponse(games, safe=False, status=response.status_code)

def retrieve_last_games(request, user_id, nb_of_games):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    response = requests.get(f"{PONG_SERVICE_URL}/retrieve_last_games/{user_id}/{nb_of_games}")
    return JsonResponse(response.json(), safe=False, status=response.status_code)

def get_game(request, game_id):
    if not check_authentication(request):
      return JsonResponse({'detail': 'Unauthorized'}, status=401)
    response = requests.get(f"{PONG_SERVICE_URL}/get-game/{game_id}/")
    return JsonResponse(response.json(), status=response.status_code)