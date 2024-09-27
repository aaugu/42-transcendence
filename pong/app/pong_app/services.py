import uuid
from .game.game import Game, GameMode, GameState
from .models import Games
from django.db.models import Q
from django.views.decorators.csrf import csrf_protect, csrf_exempt
import time
from django.http import JsonResponse

class GameAlreadyFinishedException(Exception):
    pass

class GameService:
    """
    Create a game with the specified creator ID and game mode.
    Parameters:
    - creator_id (str): The ID of the game creator.
    - mode (GameMode): The game mode.
    Returns:
    - str: The ID of the created game.
    """

    @staticmethod
    def create_game(creator_id, mode: GameMode, joiner_id):
        game_id = str(uuid.uuid4())
        game_instance = Game(mode=mode, game_id=game_id)

        if mode == GameMode.REMOTE:
            Games.objects.create(
                game_id=game_id, creator_id=creator_id, status="WAITING", mode="REMOTE"
            )

        elif mode == GameMode.LOCAL_TWO_PLAYERS:
            Games.objects.create(
                game_id=game_id,
                creator_id=creator_id,
                joiner_id=joiner_id,
                status="IN_PROGRESS",
                mode="LOCAL_TWO_PLAYERS",
            )
            game_instance.game_state.paddles[1].player_id = joiner_id

        elif mode == GameMode.TOURNAMENT_REMOTE:
            print(f"Creating TOURNAMENT REMOTE game with id {game_id}")
            Games.objects.create(
                game_id=game_id,
                creator_id=creator_id,
                status="WAITING",
                mode="TOURNAMENT-REMOTE",
            )

        game_instance.game_state.paddles[0].player_id = creator_id

        print(
            f"Created game {game_id} with user {creator_id} Left Paddle ID = {game_instance.game_state.paddles[0].player_id}"
        )

        from .consumers.consumers import PongConsumer

        PongConsumer.games[game_id] = game_instance

        print(f" Service create game: ${game_instance.game_id}, {game_instance.mode}")

        return game_instance

    @staticmethod
    def create_game_tournament(player_one_id, player_two_id, mode: GameMode):
        game_id = str(uuid.uuid4())

        Games.objects.create(
            game_id=game_id,
            creator_id=player_one_id,
            joiner_id=player_two_id,
            status="IN_PROGRESS",
            mode="TOURNAMENT",
        )
        print(f"{player_one_id} and {player_two_id}")
        game_instance = Game(mode=mode, game_id=game_id)
        game_instance.game_state.paddles[0].player_id = player_one_id
        print(f"Created game {game_id} with user {player_one_id}")
        game_instance.game_state.paddles[1].player_id = player_two_id
        print(f"Created game {game_id} with user {player_two_id}")
        from .consumers.consumers import PongConsumer

        print(
            f" Service create game tournament: ${game_instance.game_id}, {game_instance.mode}"
        )

        PongConsumer.games[game_id] = game_instance
        return game_instance

    @staticmethod
    def join_game(game_id, joiner_id):
        print(f"Joining game {game_id} with user {joiner_id}")
        game = Games.objects.get(game_id=game_id)
        game.joiner_id = joiner_id
        game.status = "IN_PROGRESS"
        from .consumers.consumers import PongConsumer

        PongConsumer.games[game_id].game_state.paddles[1].player_id = joiner_id
        print(
            f"Joined game {game_id} with user {joiner_id} Left Paddle ID = {PongConsumer.games[game_id].game_state.paddles[0].player_id} and Right Paddle ID = {PongConsumer.games[game_id].game_state.paddles[1].player_id}"
        )
        # PongConsumer.games[game_id].GameState.paused = False # Start the state of the game

        game.save()

        return game

    @staticmethod
    def end_game(request):
        print(f"Received request to end game")
        game_id = request.POST.get("game_id")
        game = Games.objects.get(game_id=game_id)
        if game.status == "FINISHED":
          raise GameAlreadyFinishedException("Game is already finished")
        winner_id = request.POST.get("winner_id")
        loser_id = request.POST.get("loser_id")

        if GameService.get_game(game_id).mode == GameMode.LOCAL_TWO_PLAYERS:
          if winner_id == 'null':
            winner_id = None
          if loser_id == 'null':
            loser_id = None

        # game = Games.objects.get(game_id=game_id)
        game.status = "FINISHED"
        game.winner_id = winner_id
        game.loser_id = loser_id
        game.save()

        # Return a dictionary that can be converted to JSON
        return {
            "game_id": game.game_id,
            "status": game.status,
            "winner_id": game.winner_id,
            "loser_id": game.loser_id,
            "mode": game.mode,
        }

    @staticmethod
    def get_game(game_id):
        game = Games.objects.get(game_id=game_id)

        return game

    @staticmethod
    def get_all_games():
        games = Games.objects.all()

        return games

    @staticmethod
    def get_user_games(user_id):
        games = Games.objects.filter(
            Q(creator_id=user_id) | Q(joiner_id=user_id),
            Q(mode="TOURNAMENT") | Q(mode="REMOTE") | Q(mode="TOURNAMENT-REMOTE") | Q(mode="LOCAL_TWO_PLAYERS"),
            status="FINISHED"
        ).order_by("-created_at")

        return games
