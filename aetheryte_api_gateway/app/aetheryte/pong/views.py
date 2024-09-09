import requests
from django.http import JsonResponse


PONG_SERVICE_URL = "http://localhost:9000"

def create_game(request, creator_id, mode):
    response = requests.post(f"{PONG_SERVICE_URL}/create-game/{creator_id}/{mode}/")
    return JsonResponse(response.json(), status=response.status_code)

def join_game(request, joiner_id, game_id):
    response = requests.post(f"{PONG_SERVICE_URL}/join-game/{joiner_id}/{game_id}/")
    return JsonResponse(response.json(), status=response.status_code)

def retrieve_last_games(request, user_id, nb_of_games):
    response = requests.get(f"{PONG_SERVICE_URL}/retrieve_last_games/{user_id}/{nb_of_games}")
    return JsonResponse(response.json(), safe=False, status=response.status_code)