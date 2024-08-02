import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .game import (
    GameState,
    checkCollisionWithEdgesBall,
    Ball,
    Paddle,
    checkCollisonWithEdgesPaddle,
    GameState,
    PARAMS,
)
import asyncio


class PongConsumer(AsyncWebsocketConsumer):
    # Shared across all instances (class-level)
    shared_game_state = GameState()
    game_loop_running = False  # To check if the game loop is already running

    async def connect(self):
        print("Connected")
        self.room_name = "pong"
        self.room_group_name = f"pong_{self.room_name}"

        # Join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accept the WebSocket connection
        await self.accept()

        # Check if the game loop is already running; if not, start it
        if not PongConsumer.game_loop_running:
            PongConsumer.game_loop_running = True
            asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        direction_right_paddle = text_data_json.get("direction_right_paddle")
        direction_left_paddle = text_data_json.get("direction_left_paddle")
        start_stop_reset = text_data_json.get("action")

        # print(f"Paddle position updated", self.shared_game_state.paddles[1].position[0][1])
        if not self.shared_game_state.paused:
            if direction_right_paddle == "up":
                self.shared_game_state.paddles[1].position[1] -= PARAMS[
                    "paddle_velocity_y"
                ]
                # print(f"Paddle position updated", self.shared_game_state.paddles[1].position[1])
            elif direction_right_paddle == "down":
                self.shared_game_state.paddles[1].position[1] += PARAMS[
                    "paddle_velocity_y"
                ]
                # print(f"Paddle position updated", self.shared_game_state.paddles[1].position[1])

            if direction_left_paddle == "up":
                self.shared_game_state.paddles[0].position[1] -= PARAMS[
                    "paddle_velocity_y"
                ]
                # print(f"Paddle position updated", self.shared_game_state.paddles[1].position[1])
            elif direction_left_paddle == "down":
                self.shared_game_state.paddles[0].position[1] += PARAMS[
                    "paddle_velocity_y"
                ]
                # print(f"Paddle position updated", self.shared_game_state.paddles[1].position[1])

        if start_stop_reset == "start":
            print(f"Start Triggered")
            self.shared_game_state.start()
        elif start_stop_reset == "pause":
            print(f"Stop Triggered")
            self.shared_game_state.pause()
        elif start_stop_reset == "reset":
            self.shared_game_state.reset_score()

    async def game_loop(self):
        while True:
            # Update shared game state
            PongConsumer.shared_game_state.update()

            # Broadcast the updated game state to all clients
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_state_update",
                    "game_state": PongConsumer.shared_game_state.to_dict(),
                },
            )

            # Pause for a short duration
            await asyncio.sleep(1 / 120)

    async def game_state_update(self, event):
        game_state = event["game_state"]

        # Send the game state to the client
        await self.send(text_data=json.dumps({"game_state": game_state}))
