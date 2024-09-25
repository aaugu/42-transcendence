from django.shortcuts import render, redirect
# from django.views.decorators.csrf import csrf_protect, csrf_exempt
from .game.game import *
from django.http import JsonResponse
from .services import GameService
from .models import Games
import json

# Create your views here.
def pong_view(request):

    context = {
        "canvas_width": PARAMS["canvas_width"],
        "canvas_height": PARAMS["canvas_height"],
        "ball_radius": PARAMS["ball_radius"],
        "ball_x": PARAMS["ball_x"],
        "ball_y": PARAMS["ball_y"],
        "paddle_width": PARAMS["paddle_width"],
        "paddle_height": PARAMS["paddle_height"],
        "controller_right_up": PARAMS["controller_right_up"],
        "controller_right_down": PARAMS["controller_right_down"],
        "controller_left_up": PARAMS["controller_left_up"],
        "controller_left_down": PARAMS["controller_left_down"],
    }

    JsonResponse(context)

    return render(request, "pong_app/pong.html", context)

def join_game(request, joiner_id, game_id):
    print(f'Received request to join game with: {joiner_id} and joiner_id: {game_id}')

    if not joiner_id or not game_id:
      return JsonResponse({"error": "Missing required parameters"}, status=400)

    GameService.join_game(joiner_id=joiner_id, game_id=game_id)

    curr_game = GameService.get_game(game_id=game_id).to_dict()

    return JsonResponse(curr_game)


def create_game(request, creator_id, mode):
    print(f'Received request to create game with creator_id: {creator_id} and mode: {mode}')

    # Vérification des paramètres
    if not creator_id or not mode:
        return JsonResponse({"error": "Missing required parameters"}, status=400)

    try:
        mode = GameMode[mode.upper()]
    except KeyError:
        return JsonResponse({"error": "Invalid game mode"}, status=400)

    # Création du jeu via un service (hypothétique)
    game = GameService.create_game(creator_id, mode)

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

    if not request.POST:
        return JsonResponse({"error": "Missing required parameters"}, status=400)

    try:
        data = GameService.end_game(request)
        return JsonResponse({"message": "Game ended", "data": data})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def retrieve_last_games(request, user_id, nb_of_games):
  print(f'Received request to get the last: {nb_of_games} of {user_id}')

  games_to_retrieve = request.GET.get("number_of_games")
  user = request.GET.get("user_id")

  games = GameService.get_all_games()
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


# def retrieve_all_games(request):


# def game_state(request):
#     state_dict = PongConsumer.shared_game_state.to_dict()
#     return JsonResponse(state_dict)



# @csrf_exempt
# def game_points(request):
#     if request.method == "POST":
#         points_to_win = request.POST.get("points_to_win")

#         # Check if points_to_win is provided and is a valid number
#         if points_to_win and points_to_win.isdigit():
#             points_to_win = int(points_to_win)
#             if points_to_win > 0:
#                 PARAMS["points_to_win"] = points_to_win
#             else:
#                 return JsonResponse({"message": "Please enter a value greater than 0"})

#         else:
#             return JsonResponse({"message": "Bad Parameter"})

#     return redirect("pong")


# @csrf_exempt
# def right_controller(request):
#     if request.method == "POST":
#         right_controller_up = request.POST.get("right_controller_up")
#         print(right_controller_up)
#         right_controller_down = request.POST.get("right_controller_down")
#         print(right_controller_down)

#         if (
#             ord(right_controller_up) >= 97
#             and ord(right_controller_up) <= 122
#             and ord(right_controller_down) >= 97
#             and ord(right_controller_down) <= 122
#         ):
#             PARAMS["controller_right_up"] = right_controller_up
#             PARAMS["controller_right_down"] = right_controller_down
#         else:
#             return JsonResponse({"message": "Controller must be a single character"})

#     return JsonResponse(
#         {
#             "message": f"controller_right_up: {right_controller_up} controller_right_down: {right_controller_down}"
#         }
#     )


# @csrf_exempt
# def left_controller(request):
#     if request.method == "POST":
#         left_controller_up = request.POST.get("left_controller_up")
#         print(left_controller_up)
#         left_controller_down = request.POST.get("left_controller_down")
#         print(left_controller_down)

#         if (
#             ord(left_controller_up) >= 97
#             and ord(left_controller_up) <= 122
#             and ord(left_controller_down) >= 97
#             and ord(left_controller_down) <= 122
#         ):
#             PARAMS["controller_left_up"] = left_controller_up
#             PARAMS["controller_left_down"] = left_controller_down
#         else:
#             return JsonResponse({"message": "Controller must be a single character"})

#     return JsonResponse(
#         {
#             "message": f"controller_left_up: {left_controller_up} controller_left_down: {left_controller_down}"
#         }
#     )


# def game_start(request):
#     PongConsumer.shared_game_state.start()
#     return redirect("pong")  # Ensure 'pong_start' matches your URL name


# def game_stop(request):
#     PongConsumer.shared_game_state.pause()
#     return redirect("pong")  # Ensure 'pong_stop' matches your URL name


# def game_reset(request):
#     try:
#         PongConsumer.shared_game_state.reset_score()
#     except Exception as e:
#         logging.exception("Error resetting game: %s", e)
#         return JsonResponse({"error": "Error resetting game"}, status=500)

#     return redirect("pong")  # Ensure 'pong_stop' matches your URL name


# @csrf_exempt
# def move_right_paddle(request):
#     if request.method == "POST":
#         print("request body:", request.body)
#         data = json.loads(request.body)
#         direction = data.get("direction_right_paddle")
#         print(f"in views", direction)
#         if direction == "up":
#             PongConsumer.shared_game_state.paddles[1].move("up")
#         else:
#             PongConsumer.shared_game_state.paddles[1].move("down")

#     return JsonResponse({"message": "Position Updated\n"})


# @csrf_exempt
# def move_left_paddle(request):
#     if request.method == "POST":
#         print("request body:", request.body)
#         data = json.loads(request.body)
#         direction = data.get("direction_left_paddle")
#         print(f"in views", direction)
#         if direction == "up":
#             PongConsumer.shared_game_state.paddles[0].move("up")
#         else:
#             PongConsumer.shared_game_state.paddles[0].move("down")

#     return JsonResponse({"message": "Position Updated\n"})
