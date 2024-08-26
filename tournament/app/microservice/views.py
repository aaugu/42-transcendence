import json
import math
import random
import datetime

from typing import Any, Optional

from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.forms.models import model_to_dict
from django.views import View
from django.db.models import Q
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password

from ..tournament import settings
from microservice import error_message as error
from microservice.models import Match, Player, Tournament


# Create your views here.

class MatchUtils:
    def get_next_match_id(match_id: int, nb_matches: int) -> int:
        return nb_matches - int((nb_matches - match_id) / 2)
    
    def matches_to_json(matches: list[Match]) -> dict[str, list[any]]:
        matches_data = [MatchUtils.match_to_json(match) for match in matches]
        data = {
            'nb-matches': len(matches),
            'matches': matches_data
        }

        return data

    def match_to_json(match: Match):
        return {
            'id': match.match_id,
            'status': MatchUtils.match_status_to_string(match.status),
            'player_1': {
                'user_id': match.player_1.user_id,
                'nickname': match.player_1.nickname
            } if match.player_1 is not None else None,
            'player_2': {
                'user_id': match.player_2.user_id,
                'nickname': match.player_2.nickname
            } if match.player_2 is not None else None,
            'player_1_score': match.player_1_score,
            'player_2_score': match.player_2_score,
            'winner': {
                'user_id': match.winner.user_id,
                'nickname': match.winner.nickname
            } if match.winner is not None else None
        }
    
    def match_status_to_string(status: int):
        match_status_msg = ["Not played", "In progress", "Finished"]

        return match_status_msg[status]

class GenerateMatchesView(View):
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            players = list(tournament.players.all())
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        try:
            body = json.loads(request.body.decode('utf8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        try:
            players = GenerateMatchesView.sort_players(players)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        matches = GenerateMatchesView.generate_matches(players, tournament)
        
        try:
            tournament.matches.all().delete()           # supprime la memoire
            Match.objects.bulk_create(matches)          # insère la liste d’objets indiquée dans la base de données de manière efficace
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        return JsonResponse(MatchUtils.matches_to_json(matches), status=200)

    def sort_players(players: list[Player]) -> list[Player]:
        random.shuffle(players)
        return players
    
    def generate_matches(players: list[Player], tournament: Tournament) -> list[Match]:
        nb_players = len(players)
        seed_order = GenerateMatchesView.get_seed_order(nb_players)
        matches = []

        for i, match in enumerate(seed_order):
            player_1 = players[match[0] - 1] if match[0] - 1 < nb_players else None
            player_2 = players[match[1] - 1] if match[1] - 1 < nb_players else None

            matches.append(
                Match(
                    player_1=player_1,
                    player_2=player_2,
                    tournament=tournament,
                    match_id=i
                )
            )
        nb_matches_first_round = len(matches)
        for i in range(0, nb_matches_first_round - 1):
            matches.append(
                Match(
                    player_1=None,
                    player_2=None,
                    tournament=tournament,
                    match_id=i + nb_matches_first_round
                )
            )
        GenerateMatchesView.manage_no_opponent(matches, nb_matches_first_round)
        return matches
    
    def get_seed_order(nb_players: int) -> list[list[int]]:
        nb_players = int(2 ** math.ceil(math.log2(nb_players)))
        rounds = int(math.log2(nb_players) - 1)
        players = [1, 2]

        for _ in range(rounds):
            players = GenerateMatchesView.next_seeding_layer(players)

        matches = []
        for i in range(0, len(players), 2):
            matches.append([players[i], players[i + 1]])

        return matches

    def next_seeding_layer(players):
        out = []
        length = len(players) * 2 + 1

        for player in players:
            out.append(player)
            out.append(length - player)

        return out
    
    def manage_no_opponent(matches: list[Match], nb_matches_first_round: int):
        for i in range(0, nb_matches_first_round):
            if matches[i].player_1 is None or matches[i].player_2 is None:
                matches[i].status = Match.FINISHED
                winner = matches[i].player_1 if matches[i].player_1 is not None else matches[i].player_2
                matches[i].winner = winner

                next_match_id = MatchUtils.get_next_match_id(i, len(matches))
                if i % 2 == 0:
                    matches[next_match_id].player_1 = winner
                else:
                    matches[next_match_id].player_2 = winner  
    
class StartMatchView(View):
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:

        try:
            body = json.loads(request.body.decode('utf8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        try:
            Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({ 'errors': [f'Tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        player1 = body.get('player1')
        player2 = body.get('player2')

        try:
            player1 = Player.objects.get(tournament_id=tournament_id, user_id=player1)
            player2 = Player.objects.get(tournament_id=tournament_id, user_id=player2)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [error.MATCH_PLAYER_NOT_EXIST]}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        try:
            match = StartMatchView.get_match(tournament_id, player1, player2)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [error.MATCH_NOT_FOUND]}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        if match.tournament.status != Tournament.IN_PROGRESS:
            return JsonResponse({'errors': [error.TOURNAMENT_NOT_STARTED]}, status=400)

        match.status = Match.IN_PROGRESS
        match.player_1_score = 0
        match.player_2_score = 0

        try:
            match.save()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        return JsonResponse(MatchUtils.match_to_json(match), status=200)

    @staticmethod
    def get_match(tournament_id: int, player1: Player, player2: Player):
        return Match.objects.get(
            tournament_id=tournament_id,
            player_1=player1,
            player_2=player2,
            status=Match.NOT_PLAYED
        )

class EndMatchView(View):
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            body = json.loads(request.body.decode('utf8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        try:
            Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'Tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        winner = body.get('winner')
        try:
            winner = Player.objects.get(tournament_id=tournament_id, user_id=winner)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [error.MATCH_PLAYER_NOT_EXIST]}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        try:
            match = EndMatchView.get_match(tournament_id, winner)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [error.MATCH_NOT_FOUND]}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        nb_matches = match.tournament.matches.count()
        try:
            EndMatchView.set_winner(match, winner)
            EndMatchView.update_tournament(match, nb_matches)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        return JsonResponse(MatchUtils.match_to_json(match), status=200)
    
    @staticmethod
    def get_match(tournament_id: int, winner: int):                         # objet utilisé pour englober plusieurs paramètre nommés.
        return Match.objects.get(                                           # peuvent être combinés à l’aide des opérateurs &, | et ^.
            Q(
                tournament_id=tournament_id,
                player_1=winner,
                status=Match.IN_PROGRESS
            ) | Q(
                tournament_id=tournament_id,
                player_2=winner,
                status=Match.IN_PROGRESS
            )
        )
    
    def set_winner(match: Match, winner: int):
        if match.player_1.user_id == winner:
            match.winner = match.player_1
        else:
            match.winner = match.player_2
        match.status = Match.FINISHED
        match.save()
    
    def update_tournament(match: Match, nb_matches: int):
        tournament = match.tournament
        nb_round = int(math.log2(nb_matches + 1))
        round_id = nb_round - int(math.log2(nb_matches - match.match_id))
        is_final = round_id == nb_round

        if is_final:
            tournament.status = Tournament.FINISHED
            tournament.save()
            return
        else:
            next_match_id = MatchUtils.get_next_match_id(match.match_id, nb_matches)
            next_match = Match.objects.get(tournament_id=tournament.pk, match_id=next_match_id)
            if match.match_id % 2 == 0:
                next_match.player_1 = match.winner
            else:
                next_match.player_2 = match.winner
            next_match.save()

class StartTournamentView(View):
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            players = tournament.players.all()
            matches = tournament.matches.all()
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        tournament.status = Tournament.IN_PROGRESS
        tournament.start_datetime = datetime.datetime.now(datetime.UTC)

        return JsonResponse({'message': f'Tournament `{tournament.name}` successfully started'}, status=200)
    
class TournamentView(View):
    def post(request: HttpRequest) -> JsonResponse:
        try:
            json_request = json.loads(request.body.decode('utf8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        valid_tournament, errors = TournamentView.is_valid_tournament(json_request)
        if not valid_tournament:
            return JsonResponse(data={'errors': errors}, status=400)
        is_private = json_request.get('is-private')
        user_id = json_request.get('user_id')
        tournament = Tournament(
            name=json_request['name'],
            is_private=is_private,
            admin_id=user_id
        )

        if is_private:
            tournament.password = make_password(json_request['password'])       #Crée une empreinte de mot de passe au format utilisé par cette application.

        max_players = json_request.get('max-players')
        if max_players is not None:
            tournament.max_players = max_players
        try:
            tournament.save()
            register_admin_errors = TournamentView.register_admin_as_player(json_request, tournament, user_id)
            if register_admin_errors is not None:
                tournament.delete()
                return JsonResponse({'errors': register_admin_errors}, status=400)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        return JsonResponse(model_to_dict(tournament, exclude=['password']), status=201)
    
    def register_admin_as_player(json_request, tournament: Tournament, user_id: int) -> Optional[list[str]]:
        admin_nickname = json_request.get('nickname')
        if admin_nickname is not None:
            valid_nickname, nickname_errors = TournamentPlayersView.is_valid_nickname(admin_nickname)
            if not valid_nickname:
                return nickname_errors
            Player.objects.create(
                nickname=admin_nickname,
                user_id=user_id,
                tournament=tournament
            )
        return None

    def is_valid_tournament(json_request: dict[str, Any]) -> tuple[bool, Optional[list[str]]]:
        errors = []
        name = json_request.get('name') 
        max_players = json_request.get('max-players')
        is_private = json_request.get('is-private')
        password = json_request.get('password')

        valid_name, name_errors = TournamentView.is_valid_name(name)
        valid_max_players, max_players_error = TournamentView.is_valid_max_players(max_players)
        valid_private, is_private_error = TournamentView.is_valid_private(is_private)
        valid_password, password_error = TournamentView.is_valid_password(password)

        if not valid_name:
            errors.extend(name_errors)
        if not valid_max_players:
            errors.append(max_players_error)
        if not valid_private:
            errors.append(is_private_error)
        if valid_private and is_private and not valid_password:
            errors.append(password_error)

        if errors:
            return False, errors
        return True, None

    def is_valid_name(name: Any) -> tuple[bool, Optional[list[str]]]:
        errors = []

        if name is None:
            return False, [error.NAME_MISSING]
        if len(name) < settings.MIN_TOURNAMENT_NAME_LENGTH:
            errors.append(error.NAME_TOO_SHORT)
        elif len(name) > settings.MAX_TOURNAMENT_NAME_LENGTH:
            errors.append(error.NAME_TOO_LONG)
        if len(name) and not name.replace(' ', '').isalnum():
            errors.append(error.NAME_INVALID_CHAR)

        if errors:
            return False, errors
        return True, None

    def is_valid_max_players(max_players: Any) -> tuple[bool, Optional[str]]:
        if max_players is None:
            return True, None
        if not isinstance(max_players, int):
            return False, error.PLAYERS_NOT_INT
        if max_players > settings.MAX_PLAYERS:
            return False, error.TOO_MANY_SLOTS
        if max_players < settings.MIN_PLAYERS:
            return False, error.NOT_ENOUGH_SLOTS
        return True, None

    def is_valid_private(is_private: Any) -> tuple[bool, Optional[str]]:
        if is_private is None:
            return False, error.IS_PRIVATE_MISSING
        elif not isinstance(is_private, bool):
            return False, error.IS_PRIVATE_NOT_BOOL
        return True, None

    def is_valid_password(password: Any) -> tuple[bool, Optional[str]]:
        if password is None:
            return False, error.PASSWORD_MISSING
        if not isinstance(password, str):
            return False, error.PASSWORD_NOT_STRING
        if len(password) < settings.PASSWORD_MIN_LENGTH:
            return False, error.PASSWORD_TOO_SHORT
        if len(password) > settings.PASSWORD_MAX_LENGTH:
            return False, error.PASSWORD_TOO_LONG
        return True, None

class TournamentPlayersView(View):
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:

        try:
            json_request = json.loads(request.body.decode('utf8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        user_nickname = json_request.get('nickname')
        user_id = json_request.get('user_id')
        valid_nickname, nickname_errors = TournamentPlayersView.is_valid_nickname(user_nickname)
        if not valid_nickname:
            return JsonResponse(data={'errors': nickname_errors}, status=400)

        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [f'An unexpected error occurred : {e}']}, status=500)

        player = Player(nickname=user_nickname, user_id=user_id, tournament=tournament)

        password = json_request.get('password')
        can_join, error_data = TournamentPlayersView.player_can_join_tournament(player, password, tournament)

        if not can_join:
            return JsonResponse({'errors': [error_data[0]]}, status=error_data[1])

        try:
            player.save()
        except Exception as e:
            return JsonResponse({'errors': [f'An unexpected error occurred : {e}']}, status=500)

        return JsonResponse(model_to_dict(player), status=201)
    
    def is_valid_nickname(nickname: str) -> tuple[bool, Optional[list[str]]]:
        errors = []

        if nickname is None:
            return False, [error.NICKNAME_MISSING]
        if len(nickname) < settings.MIN_NICKNAME_LENGTH:
            errors.append(error.NICKNAME_TOO_SHORT)
        elif len(nickname) > settings.MAX_NICKNAME_LENGTH:
            errors.append(error.NICKNAME_TOO_LONG)
        if len(nickname) and not nickname.replace(' ', '').isalnum():
            errors.append(error.NICKNAME_INVALID_CHAR)

        if errors:
            return False, errors
        return True, None

    def player_can_join_tournament(new_player: Player, password: Optional[str], tournament: Tournament)\
            -> tuple[bool, Optional[list[str | int]]]:
        try:
            tournament_players = tournament.players.all()
        except Exception as e:
            return False, [f'An unexpected error occurred : {e}', 500]

        if tournament.status != Tournament.CREATED:
            return False, ['The registration phase is over', 403]

        if tournament.is_private and password is None:
            return False, [error.PASSWORD_MISSING, 400]
        if tournament.is_private and not check_password(password, tournament.password):   #pour authentifier manuellement un utilisateur en comparant un mot de passe en clair à l’empreinte du mot de passe dans la base de données,
            return False, [error.PASSWORD_NOT_MATCH, 403]

        for player in tournament_players:
            if player.user_id == new_player.user_id:
                return False, [f'You are already registered as `{player.nickname}` for the tournament', 403]
            elif player.nickname == new_player.nickname:
                return False, [f'nickname `{player.nickname}` already taken', 400]

        try:
            user_already_in_tournament = Tournament.objects.filter(
                players__user_id=new_player.user_id,
                status__in=[Tournament.CREATED, Tournament.IN_PROGRESS]
            ).exists()
        except Exception as e:
            return False, [f'An unexpected error occurred : {e}', 500]

        if user_already_in_tournament:
            return False, ['You are already registered for another tournament', 403]

        if tournament.max_players <= len(tournament_players):
            return False, ['This tournament is fully booked', 403]

        return True, None

class TournamentlocalView(View):
    def post(request: HttpRequest) -> JsonResponse:
        try:
            json_request = json.loads(request.body.decode('utf8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        user_id = json_request.get('user_id')
        tournament = Tournament(
            name=json_request['name'],
            admin_id=user_id
        )

        max_players = json_request.get('nr_players')
        if max_players is not None:
            tournament.max_players = max_players
        try:
            tournament.save()
            register_players_errors = TournamentlocalView.register_players_as_player(json_request, tournament)
            if register_players_errors is not None:
                tournament.delete()
                return JsonResponse({'errors': register_players_errors}, status=400)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        return JsonResponse(model_to_dict(tournament, exclude=['password']), status=201)
    
    def register_players_as_player(json_request, tournament: Tournament) -> Optional[list[str]]:
        player_names = json_request.get('player_names')
        for name in player_names:
            player = Player(nickname=player_names[name], user_id=name, tournament=tournament)
            try:
                player.save()
            except Exception as e:
                return JsonResponse({'errors': [f'An unexpected error occurred : {e}']}, status=500)
        return None

class DeleteInactiveTournamentView(View):
    def delete(request: HttpRequest) -> JsonResponse:
        limit_datetime = datetime.datetime.now(datetime.UTC) - datetime.timedelta(hours=1)
        try:
            in_progress_tournaments = Tournament.objects.filter(
                status=Tournament.IN_PROGRESS
            )
            for tournament in in_progress_tournaments:
                if tournament.start_datetime < limit_datetime:
                    tournament.delete()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        return JsonResponse({'message': 'Tournament deleted'}, status=200)