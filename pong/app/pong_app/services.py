import uuid
from .game import GameState

class GameService:
    @staticmethod

    def create_game():
        game_id = str(uuid.uuid4())

        from .consumers import PongConsumer
        PongConsumer.game_states[game_id] = GameState()
        
        return game_id
