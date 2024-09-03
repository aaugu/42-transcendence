import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .game import (
    Game,
    checkCollisionWithEdgesBall,
    Ball,
    Paddle,
    checkCollisonWithEdgesPaddle,
    PARAMS,
)
from .ai import * 
import asyncio
from services import GameService

class PongConsumer(AsyncWebsocketConsumer):
    game_loops = {}
    # game_states = {}
    games = {}

    async def connect(self):
      self.game_id = self.scope['url_route']['kwargs']['game_id']
      self.room_group_name = f"pong_{self.game_id}"
      print("Connected")

      await self.channel_layer.group_add(self.room_group_name, self.channel_name)

      await self.accept()

      if self.game_id not in PongConsumer.game_loops:
          PongConsumer.game_states[self.game_id] = GameState()
          PongConsumer.game_loops[self.game_id] = True
          
          asyncio.create_task(self.game_loop())


    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        direction_right_paddle = text_data_json.get("direction_right_paddle")
        direction_left_paddle = text_data_json.get("direction_left_paddle")
        start_stop_reset = text_data_json.get("action")

        if not PongConsumer.game_states[self.game_id].paused and not PongConsumer.game_states[self.game_id].finished:
            if direction_right_paddle == "up":
              PongConsumer.game_states[self.game_id].paddles[1].move("up")
            elif direction_right_paddle == "down":
              PongConsumer.game_states[self.game_id].paddles[1].move("down")

            if direction_left_paddle == "up":
              PongConsumer.game_states[self.game_id].paddles[0].move("up")
            elif direction_left_paddle == "down":
              PongConsumer.game_states[self.game_id].paddles[0].move("down")

        if start_stop_reset == "start":
            print(f"Start Triggered")
            PongConsumer.game_states[self.game_id].start()
        elif start_stop_reset == "pause":
            print(f"Stop Triggered")
            PongConsumer.game_states[self.game_id].pause()
        elif start_stop_reset == "reset":
            PongConsumer.game_states[self.game_id].reset_score()

    async def game_loop(self):
        while True:
            PongConsumer.game_states[self.game_id].update()

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_state_update",
                    "game_state": PongConsumer.game_states[self.game_id].to_dict(),
                },
            )

            await asyncio.sleep(1 / 120)

    async def game_state_update(self, event):
        game_state = event["game_state"]

        # Send the game state to the client
        await self.send(text_data=json.dumps({"game_state": game_state}))
