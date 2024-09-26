from tournament import settings

NAME_MISSING = 'Missing name field'
NAME_TOO_SHORT = f'Tournament name must contain at least {settings.MIN_TOURNAMENT_NAME_LENGTH} characters'
NAME_TOO_LONG = f'Tournament name must contain less than {settings.MAX_TOURNAMENT_NAME_LENGTH} characters'
NAME_INVALID_CHAR = 'Tournament name may only contain letters, numbers and spaces'

IS_TYPE_MISSING = 'Missing type field'
TYPE_NOT_STRING = 'Type must be a string'
TYPE_NOT_MATCH = 'Type must be local or remote'

NICKNAME_MISSING = 'Missing nickname field'
NICKNAME_TOO_SHORT = f'Nickname must contain at least {settings.MIN_NICKNAME_LENGTH} characters'
NICKNAME_TOO_LONG = f'Nickname must contain less than {settings.MAX_NICKNAME_LENGTH} characters'
NICKNAME_INVALID_CHAR = 'Nickname may only contain letters, numbers and spaces'

NOT_REGISTERED = 'You are not registered for this tournament'
USER_NOT_REGISTERED = 'User is not registered for this tournament'
CANT_LEAVE = 'You can not leave this tournament'

PLAYERS_NOT_INT = 'Player field must be an integer'
TOO_MANY_SLOTS = f'Tournament must contain less or equal than {settings.MAX_PLAYERS} slots'
NOT_ENOUGH_SLOTS = f'Tournament must contain at least {settings.MIN_PLAYERS} slots'

TOURNAMENT_NOT_STARTED = 'Tournament has not started'
MATCH_PLAYER_NOT_EXIST = 'Player does not exist'
MATCH_NOT_FOUND = 'Match not found'
BAD_JSON_FORMAT = 'Invalid JSON format in request body'

NOT_ENOUGH_PLAYERS = 'Not enough players to start tournament'
MATCHES_NOT_GENERATED = 'Matches have not been generated yet'