import math

PARAMS = {
    "canvas_width": 800,
    "canvas_height": 400,
    "ball_x": 200,
    "ball_y": 200,
    "ball_radius": 4,
    "ball_velocity_x": 3.5,
    "ball_velocity_y": 3.5,
    "paddle_width": 5,
    "paddle_height": 90,
    "paddle_velocity_x": 5,
    "paddle_velocity_y": 9,
    "points_to_win": 5,
    "controller_right_up": "j",
    "controller_right_down": "n",
    "controller_left_up": "f",
    "controller_left_down": "v",
}

MAX_BOUNCE_ANGLE = 4 * math.pi / 12
INITIAL_BALL_SPEED = math.sqrt(
    PARAMS["ball_velocity_x"] ** 2 + PARAMS["ball_velocity_y"] ** 2
)