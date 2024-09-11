import json
from channels.generic.websocket import AsyncWebsocketConsumer
from ..ai.ai import *
import asyncio

# from .services import GameService


class PongConsumer(AsyncWebsocketConsumer):
    game_loops = {}
    games = {}

    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        print(f"Game ID: {self.game_id}")
        self.room_group_name = f"pong_{self.game_id}"
        print("Connected")

        if self.game_id not in PongConsumer.games:
            print(f"This should never happends problem somewhere")

            asyncio.create_task(self.game_loop())

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

        if self.game_id not in PongConsumer.game_loops:
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

        if (
            not PongConsumer.games[self.game_id].game_state.paused
            and not PongConsumer.games[self.game_id].game_state.finished
        ):
            if direction_right_paddle == "up":
              PongConsumer.games[self.game_id].game_state.paddles[1].move("up")
            elif direction_right_paddle == "down":
              PongConsumer.games[self.game_id].game_state.paddles[1].move("down")

            if direction_left_paddle == "up":
              PongConsumer.games[self.game_id].game_state.paddles[0].move("up")
            elif direction_left_paddle == "down":
              PongConsumer.games[self.game_id].game_state.paddles[0].move("down")

        if start_stop_reset == "start":
            print(f"Start Triggered")
            PongConsumer.games[self.game_id].game_state.start()
        elif start_stop_reset == "pause":
            print(f"Stop Triggered")
            PongConsumer.games[self.game_id].game_state.pause()
        elif start_stop_reset == "reset":
            PongConsumer.games[self.game_id].game_state.reset_score()

    async def game_loop(self):
        while True:
            # Update de the game_state
            PongConsumer.games[self.game_id].game_state.update()

            if PongConsumer.games[self.game_id].game_state.finished:
                print(f"Game {self.game_id} finished")


                winner_id, loser_id = self.determine_winner_loser()

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "game_finished",
                        "winner_id": winner_id,
                        "loser_id": loser_id,
                        "game_state": PongConsumer.games[
                            self.game_id
                        ].game_state.to_dict(),
                    },
                )

                break

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "game_state_update",
                    "game_state": PongConsumer.games[self.game_id].game_state.to_dict(),
                },
            )

            await asyncio.sleep(1 / 60)

    async def game_state_update(self, event):
        game_state = event["game_state"]

        # Send the game state to the client
        await self.send(text_data=json.dumps({"game_state": game_state}))

    def determine_winner_loser(self):
        # Determine the winner and loser based on the final score
        if (
            PongConsumer.games[self.game_id].game_state.score[0]
            > PongConsumer.games[self.game_id].game_state.score[1]
        ):
            winner_id = PongConsumer.games[self.game_id].game_state.paddles[0].player_id
            loser_id = PongConsumer.games[self.game_id].game_state.paddles[1].player_id
        else:
            winner_id = PongConsumer.games[self.game_id].game_state.paddles[1].player_id
            loser_id = PongConsumer.games[self.game_id].game_state.paddles[0].player_id
        return winner_id, loser_id

    