import uuid
from .game import Game, GameMode, GameState
from .models import Games


class GameService:
    '''
    Create a game with the specified creator ID and game mode.
    Parameters:
    - creator_id (str): The ID of the game creator.
    - mode (GameMode): The game mode.
    Returns:
    - str: The ID of the created game.
    '''
    @staticmethod
    
    def create_game(creator_id, mode: GameMode):
        game_id = str(uuid.uuid4())
        
        if mode == GameMode.REMOTE:
            Games.objects.create(
                game_id=game_id,
                creator_id=creator_id,
                status='WAITING',
                mode="REMOTE"
            )

        else:
            Games.objects.create(
                game_id=game_id,
                creator_id=creator_id,
                status='IN_PROGRESS',
                mode="NOT REMOTE"
            )

        game_instance = Game(mode=mode, game_id=game_id)

        from .consumers import PongConsumer
        PongConsumer.games[game_id]= game_instance
        PongConsumer.games[game_id].game_state = GameState()

        print(game_instance.to_dict())
        
        return game_instance

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
