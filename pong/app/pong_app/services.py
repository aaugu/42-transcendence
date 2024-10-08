import uuid
from .game.game import Game, GameMode, GameState
from .models import Games
from django.db.models import Q

class GameAlreadyFinishedException(Exception):
    pass

class GameService:
    """
      - Service class for game operations
      - Create, end, get games
    """

    @staticmethod
    def create_game(creator_id, mode: GameMode, joiner_id):
        game_id = str(uuid.uuid4())
        game_instance = Game(mode=mode, game_id=game_id)

        if mode == GameMode.LOCAL_TWO_PLAYERS:
            Games.objects.create(
                game_id=game_id,
                creator_id=creator_id,
                joiner_id=joiner_id,
                status="IN_PROGRESS",
                mode="LOCAL_TWO_PLAYERS",
            )
            game_instance.game_state.paddles[1].player_id = joiner_id

        game_instance.game_state.paddles[0].player_id = creator_id

        from .consumers.consumers import PongConsumer
        PongConsumer.games[game_id] = game_instance

        return game_instance

    @staticmethod
    def create_game_remote(player_one_id, player_two_id, mode: GameMode):
      game_id = str(uuid.uuid4())

      if mode == GameMode.REMOTE:
        Games.objects.create(
          game_id=game_id,
          creator_id=player_one_id,
          joiner_id=player_two_id,
          status="IN_PROGRESS",
          mode="REMOTE"
        )

      game_instance = Game(mode=mode, game_id=game_id)
      game_instance.game_state.paddles[0].player_id = player_one_id
      game_instance.game_state.paddles[1].player_id = player_two_id

      from .consumers.consumers import PongConsumer
      PongConsumer.games[game_id] = game_instance

      return game_instance

    @staticmethod
    def create_game_tournament(player_one_id, player_two_id, mode: GameMode):
        game_id = str(uuid.uuid4())

        if mode == GameMode.TOURNAMENT:
            Games.objects.create(
                game_id=game_id,
                creator_id=player_one_id,
                joiner_id=player_two_id,
                status="IN_PROGRESS",
                mode="TOURNAMENT",
            )

        elif mode == GameMode.TOURNAMENT_REMOTE:
            Games.objects.create(
                game_id=game_id,
                creator_id=player_one_id,
                joiner_id=player_two_id,
                status="WAITING",
                mode="TOURNAMENT-REMOTE",
            )

        game_instance = Game(mode=mode, game_id=game_id)
        game_instance.game_state.paddles[0].player_id = player_one_id
        game_instance.game_state.paddles[1].player_id = player_two_id

        from .consumers.consumers import PongConsumer
        PongConsumer.games[game_id] = game_instance

        return game_instance

    @staticmethod
    def end_game(request):
        game_id = request.POST.get("game_id")
        game = Games.objects.get(game_id=game_id)

        from .consumers.consumers import PongConsumer
        PongConsumer.games[game_id].game_state.finished = True
        
        if game.status == "FINISHED":
          raise GameAlreadyFinishedException("Game is already finished")
        winner_id = request.POST.get("winner_id")
        loser_id = request.POST.get("loser_id")

        if GameService.get_game(game_id).mode == GameMode.LOCAL_TWO_PLAYERS:
          if winner_id == 'null':
            winner_id = None
          if loser_id == 'null':
            loser_id = None

        game.status = "FINISHED"
        game.winner_id = winner_id
        game.loser_id = loser_id
        game.save()

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
