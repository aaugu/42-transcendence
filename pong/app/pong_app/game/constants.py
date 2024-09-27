import math

PARAMS = {
    "canvas_width": 1100,
    "canvas_height": 550,
    "ball_x": 200,
    "ball_y": 200,
    "ball_radius": 10,
    "ball_velocity_x": 6,
    "ball_velocity_y": 0,
    "paddle_width": 15,
    "paddle_height": 100,
    "paddle_velocity_x": 5,
    "paddle_velocity_y": 9,
    "points_to_win": 3,
    "controller_right_up": "j",
    "controller_right_down": "n",
    "controller_left_up": "f",
    "controller_left_down": "v",
}

MAX_BOUNCE_ANGLE = 4 * math.pi / 12
INITIAL_BALL_SPEED = math.sqrt(
    PARAMS["ball_velocity_x"] ** 2 + PARAMS["ball_velocity_y"] ** 2
)