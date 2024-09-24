import json
from channels.generic.websocket import AsyncWebsocketConsumer
from ..ai.ai import *
import asyncio

# from .services import GameService


class PongConsumer(AsyncWebsocketConsumer):
    game_loops = {}
    games = {}
    user_per_room = {}
    players_in_game = {}

    async def connect(self):
        self.game_id = self.scope["url_route"]["kwargs"]["game_id"]
        self.room_group_name = f"pong_{self.game_id}"

        # Check if the game exists
        if self.game_id not in PongConsumer.games:
            await self.close()
            return

        game = PongConsumer.games[self.game_id]
        game_mode = PongConsumer.games[self.game_id].mode

        # Initialize user count if not exists
        if self.game_id not in PongConsumer.user_per_room:
            print(f"In connect method, user_per_room: {PongConsumer.user_per_room}")
            PongConsumer.user_per_room[self.game_id] = 0

        print(
            f"User count for game {self.game_id}: {PongConsumer.user_per_room[self.game_id]}"
        )
        # Check connection limits based on game mode
        if game_mode == GameMode.LOCAL_TWO_PLAYERS:
            if PongConsumer.user_per_room[self.game_id] > 0:
                print(
                    f"LOCAL_TWO_PLAYERS game {self.game_id} already has a connection. Rejecting new connection."
                )
                await self.close()
                return
        elif game_mode == GameMode.TOURNAMENT:
            if PongConsumer.user_per_room[self.game_id] > 0:
                print(
                    f"TOURNAMENT game {self.game_id} is full. Rejecting new connection."
                )
                await self.close()
                return
        elif game_mode == GameMode.REMOTE:
            if PongConsumer.user_per_room[self.game_id] >= 2:
                print(f"REMOTE game {self.game_id} is full. Rejecting new connection.")
                await self.close()
                return

        # Increment user count for the game
        if PongConsumer.user_per_room[self.game_id] == 0 and GameMode.REMOTE:
            self.player_id = game.game_state.paddles[
                0
            ].player_id  # Track the player in self
            PongConsumer.players_in_game[self.game_id] = game.game_state.paddles[
                0
            ].player_id
        elif PongConsumer.user_per_room[self.game_id] == 1 and GameMode.REMOTE:
            self.player_id = game.game_state.paddles[
                1
            ].player_id  # Track the player in self
            PongConsumer.players_in_game[self.game_id] = game.game_state.paddles[
                1
            ].player_id

        PongConsumer.user_per_room[self.game_id] += 1

        print(f"Consumer players in game: {PongConsumer.players_in_game}")

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        if self.game_id not in PongConsumer.game_loops:
            PongConsumer.game_loops[self.game_id] = True
            asyncio.create_task(self.game_loop())

    async def disconnect(self, close_code):
        print("Consumer disconnected")

        # Decrement user count for the room
        if self.game_id in PongConsumer.user_per_room:
            PongConsumer.user_per_room[self.game_id] -= 1

        if hasattr(self, "player_id"):
            disconnection_message = {
                "type": "player_disconnect",
                "player_id": self.player_id,
                "message": f"Player {self.player_id} has disconnected",
            }
            await self.channel_layer.group_send(
                self.room_group_name, disconnection_message
            )

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

    # async def game_loop(self):
    #     while True:
    #         if PongConsumer.games[self.game_id].mode == GameMode.REMOTE:
    #             PongConsumer.games[self.game_id].game_state.start()

    #         # Update de the game_state
    #         PongConsumer.games[self.game_id].game_state.update()

    #         if PongConsumer.games[self.game_id].game_state.finished:
    #             print(f"Game {self.game_id} finished, mode: {PongConsumer.games[self.game_id].mode}")

    #             winner_id, loser_id = self.determine_winner_loser()

    #             await self.channel_layer.group_send(
    #                 self.room_group_name,
    #                 {
    #                     "type": "game_finished",
    #                     "winner_id": winner_id,
    #                     "loser_id": loser_id,
    #                     "game": PongConsumer.games[self.game_id].to_dict(),
    #                 },
    #             )

    #             if PongConsumer.games[self.game_id].mode == GameMode.TOURNAMENT:
    #                 print(f"Game {self.game_id} is a tournament game, a end game message will be sent")

    #                 # Delay 3 seconds before reseting the game
    #                 await asyncio.sleep(5)
    #                 PongConsumer.games[self.game_id].game_state.reset_score()
    #                 PongConsumer.games[self.game_id].game_state.finished = False

    #             else:
    #                 break

    #         await self.channel_layer.group_send(
    #             self.room_group_name,
    #             {
    #                 "type": "game_state_update",
    #                 "game_state": PongConsumer.games[self.game_id].game_state.to_dict(),
    #             },
    #         )

    #         await asyncio.sleep(1 / 120)

    async def game_loop(self):
        while True:
            if PongConsumer.games[self.game_id].mode == GameMode.REMOTE:
                PongConsumer.games[self.game_id].game_state.start()

            # Update de the game_state
            PongConsumer.games[self.game_id].game_state.update()

            if PongConsumer.games[self.game_id].game_state.finished:
                print(
                    f"Game {self.game_id} finished, mode: {PongConsumer.games[self.game_id].mode}"
                )

                winner_id, loser_id = self.determine_winner_loser()

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "game_finished",
                        "winner_id": winner_id,
                        "loser_id": loser_id,
                        "game": PongConsumer.games[self.game_id].to_dict(),
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

            await asyncio.sleep(1 / 120)

    async def game_state_update(self, event):
        game_state = event["game_state"]

        # Send the game state to the client
        await self.send(text_data=json.dumps({"game_state": game_state}))

    async def game_finished(self, event):
        print("Game Finished Method Called")
        game = event["game"]
        winner_id = event["winner_id"]
        loser_id = event["loser_id"]

        game_id = game["game_id"]

        # Send the game state to the client
        await self.send(
            text_data=json.dumps(
                {
                    "game": game,
                    "winner_id": winner_id,
                    "loser_id": loser_id,
                    "game_finished": True,
                    "game_id": game_id,
                }
            )
        )

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
