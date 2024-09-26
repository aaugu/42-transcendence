import math
import time
from enum import Enum
from .constants import *

# https://gamedev.stackexchange.com/questions/4253/in-pong-how-do-you-calculate-the-balls-direction-when-it-bounces-off-the-paddl

COLLISION_TRESHOLD = 2

class Ball:
    def __init__(self, position, velocity, radius):
        self.position = position
        self.velocity = velocity
        self.radius = radius

    def move(self):
        self.position[0] += self.velocity[0]
        self.position[1] += self.velocity[1]


def check_collision_with_edgesBall(ball):
    if ball.position[1] + PARAMS["ball_radius"] >= PARAMS["canvas_height"]:
        ball.velocity[1] *= -1
    if ball.position[1] - ball.radius <= 0:
        ball.velocity[1] *= -1


def check_goal(ball, score, game_state):
    if ball.position[0] + PARAMS["ball_radius"] >= PARAMS["canvas_width"]:
        score[0] += 1
        # ball.velocity[0] *= -1
        game_state.ballReset(0)

    if ball.position[0] - ball.radius <= 0:
        score[1] += 1
        # ball.velocity[0] *= -1
        game_state.ballReset(1)


def check_collision_with_paddlesBall(ball, paddles):
    INITIAL_BALL_SPEED = math.sqrt(
        PARAMS["ball_velocity_x"] ** 2 + PARAMS["ball_velocity_y"] ** 2
    )
    # Right paddle collision
    if (
        ball.position[0] + PARAMS["ball_radius"] >= paddles[1].position[0] - COLLISION_TRESHOLD
        and ball.position[1] >= paddles[1].position[1]
        and ball.position[1] <= paddles[1].position[1] + paddles[1].height
    ):
        relativeIntersectY = ball.position[1] - (
            paddles[1].position[1] + (paddles[1].height / 2)
        )
        normalizedRelativeIntersectionY = relativeIntersectY / (paddles[1].height / 2)
        bounceAngle = normalizedRelativeIntersectionY * MAX_BOUNCE_ANGLE

        ball.velocity[0] = -INITIAL_BALL_SPEED * math.cos(bounceAngle)
        ball.velocity[1] = INITIAL_BALL_SPEED * math.sin(bounceAngle)

    # Left paddle collision
    if (
        ball.position[0] - PARAMS["ball_radius"]
        <= paddles[0].position[0] + paddles[0].width + COLLISION_TRESHOLD
        and ball.position[1] >= paddles[0].position[1]
        and ball.position[1] <= paddles[0].position[1] + paddles[0].height
    ):
        relativeIntersectY = ball.position[1] - (
            paddles[0].position[1] + (paddles[0].height / 2)
        )
        normalizedRelativeIntersectionY = relativeIntersectY / (paddles[0].height / 2)
        bounceAngle = normalizedRelativeIntersectionY * MAX_BOUNCE_ANGLE

        ball.velocity[0] = INITIAL_BALL_SPEED * math.cos(bounceAngle)
        ball.velocity[1] = INITIAL_BALL_SPEED * math.sin(bounceAngle)


class Paddle:
    def __init__(self, position, player_id, velocity, width, height):
        self.player_id = player_id
        self.position = position
        self.velocity = velocity
        self.width = width
        self.height = height

    def move(self, direction):
      if (direction == "up"):
        self.position[1] -= PARAMS['paddle_velocity_y']
      elif (direction == "down"):
        self.position[1] += PARAMS['paddle_velocity_y']
      check_collision_with_edges_paddle(self)


def check_collision_with_edges_paddle(paddle):
    if paddle.position[1] >= PARAMS["canvas_height"] - PARAMS["paddle_height"]:
        paddle.position[1] = PARAMS["canvas_height"] - PARAMS["paddle_height"]
    if paddle.position[1] <= 0:
        paddle.position[1] = 0

class GameMode(Enum):
    LOCAL_TWO_PLAYERS = 1
    TOURNAMENT = 2
    REMOTE = 3
    TOURNAMENT_REMOTE = 4


class Game:
    def __init__(self, game_id, mode):
        self.game_state = GameState()
        self.game_id = game_id
        self.mode = mode

    def to_dict(self):
        return {
            "game_state": self.game_state.to_dict(),
            "mode": self.mode.name,
            "game_id": self.game_id,
        }


class GameState:
    def __init__(self):
        self.ball = Ball(
            position=[PARAMS["ball_x"], PARAMS["ball_y"]],
            velocity=[PARAMS["ball_velocity_x"], PARAMS["ball_velocity_y"]],
            radius=PARAMS["ball_radius"],
        )

        self.paddles = [
            Paddle(
                player_id=None,
                position=[0, 50],
                velocity=[PARAMS["paddle_velocity_x"], PARAMS["paddle_velocity_y"]],
                width=PARAMS["paddle_width"],
                height=PARAMS["paddle_height"],
            ),
            Paddle(
                player_id=None,
                position=[PARAMS["canvas_width"] - 5, 50],
                velocity=[PARAMS["paddle_velocity_x"], PARAMS["paddle_velocity_y"]],
                width=PARAMS["paddle_width"],
                height=PARAMS["paddle_height"],
            ),
        ]

        self.score = [0, 0]

        self.reset_timer = None

        self.paused = True

        self.finished = False

    def update(self):
        if self.score[0] == PARAMS["points_to_win"] or self.score[1] == PARAMS["points_to_win"]:
          self.finished = True

        if self.finished == False:
          if (
              self.paused == False
          ):
              if self.reset_timer is None:
                  self.ball.move()
                  check_collision_with_edgesBall(self.ball)
                  check_collision_with_edges_paddle(self.paddles[0])
                  check_collision_with_edges_paddle(self.paddles[1])
                  check_collision_with_paddlesBall(self.ball, self.paddles)
                  check_goal(self.ball, self.score, self)
              else:
                  if time.time() >= self.reset_timer:
                      self.reset_timer = None
                      self.ball.radius = PARAMS["ball_radius"]

    def pause(self):
        if self.paused == False:
            self.paused = True

    def start(self):
        if self.paused == True:
            self.paused = False

    def reset_score(self):
        print(f"Resetting score")
        self.ballReset(1)
        self.score = [0, 0]
        self.finished = False
        self.paused = False

    def ballReset(self, pos):
        self.ball.position[0] = PARAMS["canvas_width"] / 2
        self.ball.position[1] = PARAMS["canvas_height"] / 2
        self.ball.radius = 0
        self.reset_timer = time.time() + 0.5

        if pos == 1:
            self.ball.velocity[0] = PARAMS["ball_velocity_x"]
            self.ball.velocity[1] = 0
        else:
            self.ball.velocity[0] = -PARAMS["ball_velocity_x"]
            self.ball.velocity[1] = 0

    def to_dict(self):
        return {
            "ball": {
                "position": self.ball.position,
                "velocity": self.ball.velocity,
            },
            "paddles": [
                {
                    "player_id": paddle.player_id,
                    "position": paddle.position,
                    "velocity": paddle.velocity,
                    "width": paddle.width,
                    "height": paddle.height,
                }
                for paddle in self.paddles
            ],
            "scores": self.score,

            "finished": self.finished,
        }
