from .game import *
import asyncio
import time


class AI:
    def __init__(self, game_state):
        self.game_state = game_state


    async def play_1(self):
        while True:
            if not self.game_state.paused:
                self.game_state.paddles[1].move("up")
                await asyncio.sleep(0.5)
                self.game_state.paddles[1].move("up")
                await asyncio.sleep(0.5)
                self.game_state.paddles[1].move("down")
                await asyncio.sleep(0.5)
                self.game_state.paddles[1].move("down")
                await asyncio.sleep(0.5)
                self.game_state.paddles[1].move("down")
                await asyncio.sleep(0.5)
                self.game_state.paddles[1].move("down")
            else:
                await asyncio.sleep(1)  # Sleep for a while if the game is paused

    async def play_2(self):
        while True:
            if not self.game_state.paused and not self.game_state.finished:
              await asyncio.sleep(1)
              print(f"Ball: {self.game_state.ball.position[1]}")
              print(f"Paddle: {self.game_state.paddles[1].position[1]}")
              print(f"Middle paddle: {self.game_state.paddles[1].position[1] + (PARAMS['paddle_height'] / 2)}")
              print(f"Ball Velocity: {self.game_state.ball.velocity[0]} - {self.game_state.ball.velocity[1]} ")
              if self.game_state.ball.position[1] > self.game_state.paddles[1].position[1]:
                self.game_state.paddles[1].move("down")
              elif self.game_state.ball.position[1] < self.game_state.paddles[1].position[1]:
                self.game_state.paddles[1].move("up")
            else:
                await asyncio.sleep(1)  # Sleep for a while if the game is paused