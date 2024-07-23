from django.shortcuts import render, redirect
from .game import PARAMS
from .consumers import PongConsumer
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse

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
    }
    return render(request, 'pong_app/pong.html', context)

def pong_state(request):
  state_dict = PongConsumer.shared_game_state.to_dict()
  return JsonResponse(state_dict)
