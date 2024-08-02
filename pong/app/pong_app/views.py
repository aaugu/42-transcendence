from django.shortcuts import render, redirect
from .game import PARAMS
from .consumers import PongConsumer
from django.views.decorators.csrf import csrf_protect, csrf_exempt
from django.http import JsonResponse
import logging


# Create your views here.
def pong_view(request):
    if request.method == 'POST':
        ball_speed = request.POST.get('ball_speed')
        
        # Check if ball_speed is provided and is a valid number
        if ball_speed and ball_speed.isdigit():
            ball_speed = int(ball_speed)
            PARAMS['ball_velocity_x'] = ball_speed
            PARAMS['ball_velocity_y'] = ball_speed  # Assuming you want to update both velocities
            
        # Redirect to the same view to see the updated game parameters
        return redirect('pong')  # Ensure 'pong_view' matches your URL name

    context = {
        'canvas_width': PARAMS['canvas_width'],
        'canvas_height': PARAMS['canvas_height'],
        'ball_radius': PARAMS['ball_radius'],
        'ball_x': PARAMS['ball_x'],
        'ball_y': PARAMS['ball_y'],
        'paddle_width': PARAMS['paddle_width'],
        'paddle_height': PARAMS['paddle_height'],
        'controller_right_up': PARAMS['controller_right_up'],
        'controller_right_down': PARAMS['controller_right_down'],
        'controller_left_up': PARAMS['controller_left_up'],
        'controller_left_down': PARAMS['controller_left_down'],
    }
    return render(request, 'pong_app/pong.html', context)

def game_state(request):
  state_dict = PongConsumer.shared_game_state.to_dict()
  return JsonResponse(state_dict)

@csrf_exempt
def game_points(request):
  if request.method == 'POST':
    points_to_win = request.POST.get('points_to_win')
    
    # Check if points_to_win is provided and is a valid number
    if points_to_win and points_to_win.isdigit():
      points_to_win = int(points_to_win)
      if (points_to_win > 0):
        PARAMS['points_to_win'] = points_to_win
      else:
        return JsonResponse({'message': 'Please enter a value greater than 0'})

    else:
        return JsonResponse({'message': 'Bad Parameter'})
      
  return redirect('pong')

@csrf_exempt
def right_controller(request):
  if request.method == 'POST':
    right_controller_up = request.POST.get('right_controller_up')
    print(right_controller_up)
    right_controller_down = request.POST.get('right_controller_down')
    print(right_controller_down)

    if (ord(right_controller_up) >= 97 and ord(right_controller_up) <= 122 and ord(right_controller_down) >= 97 and ord(right_controller_down) <= 122):
      PARAMS["controller_right_up"] = right_controller_up
      PARAMS["controller_right_down"] = right_controller_down
    else:
      return JsonResponse({'message': 'Controller must be a single character'})
      
  return JsonResponse({'message': f'controller_right_up: {right_controller_up} controller_right_down: {right_controller_down}'})

@csrf_exempt
def left_controller(request):
  if request.method == 'POST':
    left_controller_up = request.POST.get('left_controller_up')
    print(left_controller_up)
    left_controller_down = request.POST.get('left_controller_down')
    print(left_controller_down)

    if (ord(left_controller_up) >= 97 and ord(left_controller_up) <= 122 and ord(left_controller_down) >= 97 and ord(left_controller_down) <= 122):
      PARAMS["controller_left_up"] = left_controller_up
      PARAMS["controller_left_down"] = left_controller_down
    else:
      return JsonResponse({'message': 'Controller must be a single character'})
      
  return JsonResponse({'message': f'controller_left_up: {left_controller_up} controller_left_down: {left_controller_down}'})

def game_start(request):
  PongConsumer.shared_game_state.start()
  return redirect('pong')  # Ensure 'pong_start' matches your URL name
  
def game_stop(request):
  PongConsumer.shared_game_state.pause()
  return redirect('pong')  # Ensure 'pong_stop' matches your URL name
  
# def game_reset(request):
#   PongConsumer.shared_game_reset.reset_score()
#   return redirect('pong')  # Ensure 'pong_stop' matches your URL name

def game_reset(request):
    try:
        PongConsumer.shared_game_state.reset_score()
    except Exception as e:
        logging.exception("Error resetting game: %s", e)
        return JsonResponse({'error': 'Error resetting game'}, status=500)

    return redirect('pong')  # Ensure 'pong_stop' matches your URL name