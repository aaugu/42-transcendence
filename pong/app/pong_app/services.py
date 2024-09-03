import uuid
from .game import Game
from .models import Games
from .consumers import PongConsumer

class GameService:
    @staticmethod
    def create_game(creator_id):
        game_id = str(uuid.uuid4())
        
        game = Games.objects.create(
            game_id=game_id,
            creator_id=creator_id,
            status='WAITING'
        )
        PongConsumer.ame.game_state[game_id] = GameState()
        
        return game.game_id

    @staticmethod
    def join_game(game_id, joiner_id):
        game = Games.objects.get(game_id=game_id)
        game.joiner_id = joiner_id
        game.status = 'IN_PROGRESS'
        game.save()

        return game

    @staticmethod
    def end_game(game_id, winner_id, looser_id):
        game = Games.objects.get(game_id=game_id)
        game.status = 'FINISHED'
        game.winner_id = winner_id
        game.looser_id = looser_id
        game.save()
        
        return game
