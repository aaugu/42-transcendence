from django.shortcuts import render, redirect
from ..game.game import *
from ..consumers.consumers import PongConsumer
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import JsonResponse
import json
from .services import GameService
# from .consumers import PongConsumer

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

def create_game(request):
    print(f'Received request to create game with creator_id: {request.GET.get("str_creator_id")} and mode: {request.GET.get("str_mode")}')

    creator_id = request.GET.get("creator_id")
    mode = request.GET.get("mode")
    
    if not creator_id or not mode:
        return JsonResponse({"error": "Missing required parameters"}, status=400)

    try:
        game_mode = GameMode[mode.upper()]
    except KeyError:
        return JsonResponse({"error": "Invalid game mode"}, status=400)

    game = GameService.create_game(creator_id, game_mode)

    return JsonResponse(game.to_dict())

def retrieve_last_games(request):


def retrieve_all_games(request, nb_games):


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
