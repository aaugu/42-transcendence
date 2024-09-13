import json
import math
import random
import datetime
import requests

from typing import Any, Optional

from django.shortcuts import render
from django.http import HttpRequest, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.forms.models import model_to_dict
from django.views import View
from django.db.models import Q
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from tournament import settings
from microservice import error_message as error
from microservice.models import Match, Player, Tournament


# Create your views here.

class MatchUtils:
    @staticmethod
    def get_next_match_id(match_id: int, nb_matches: int) -> int:
        return nb_matches - int((nb_matches - match_id) / 2)
    
    @staticmethod
    def matches_to_json(matches: list[Match]) -> dict[str, list[any]]:
        matches_data = [MatchUtils.match_to_json(match) for match in matches]
        data = {
            'nb_matches': len(matches),
            'matches': matches_data
        }

        return data
    @staticmethod
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
            'winner': {
                'user_id': match.winner.user_id,
                'nickname': match.winner.nickname
            } if match.winner is not None else None
        }
    @staticmethod
    def match_status_to_string(status: int):
        match_status_msg = ["Not played", "In progress", "Finished"]

        return match_status_msg[status]

class TournamentUtils:
    @staticmethod
    def tournament_to_json(tournaments):
        tournaments_data = [{
            'id': tournament.id,
            'name': tournament.name,
            'max_players': tournament.max_players,
            'nb_players': tournament.players.count(),
            'is_private': tournament.is_private,
            'type': TournamentUtils.status_to_string(tournament.type),
            'status': TournamentUtils.status_to_string(tournament.status),
            'admin-id': tournament.admin_id
        } for tournament in tournaments]

        return tournaments_data

    @staticmethod
    def status_to_string(status: int) -> str:
        status_string = ['Created', 'In progress', 'Finished', 'Local', 'Remote']
        return status_string[status]

@method_decorator(csrf_exempt, name='dispatch')
class GenerateMatchesView(View):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            matches = list(tournament.matches.all().order_by('match_id'))
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        return JsonResponse(MatchUtils.matches_to_json(matches), status=200)

    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            players = list(tournament.players.all())
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
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
    
    @staticmethod
    def sort_players(players: list[Player]) -> list[Player]:
        random.shuffle(players)
        return players
    
    @staticmethod
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
    
    @staticmethod
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

    @staticmethod
    def next_seeding_layer(players):
        out = []
        length = len(players) * 2 + 1

        for player in players:
            out.append(player)
            out.append(length - player)

        return out
    
    @staticmethod
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

@method_decorator(csrf_exempt, name='dispatch')    
class StartMatchView(View):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:

        try:
            body = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        try:
            Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({ 'errors': [f'Tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        player1 = body.get('player_1')
        player2 = body.get('player_2')

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

        try:
            match.save()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        
        # StartMatchView.send_match_start_notif(match.tournament, player1, player2)

        return JsonResponse(MatchUtils.match_to_json(match), status=200)

    # @staticmethod
    # def send_match_start_notif(tournament: Tournament, player1: Player, player2: Player):
    #     request_url = "http://localhost:8000/livechat/notification/"
    #     json_request = {
    #         'tounament_name': tournament.name,
    #         'player_1': {
    #             'user_id': player1.user_id,
    #             'nickname': player1.nickname
    #         } if player1 is not None else None,
    #         'player_2': {
    #             'user_id': player2.user_id,
    #             'nickname': player2.nickname
    #         } if player2 is not None else None,
    #     }
    #     return requests.post(url = request_url, json = json_request)

    @staticmethod
    def get_match(tournament_id: int, player1: Player, player2: Player):
        return Match.objects.get(
            tournament_id=tournament_id,
            player_1=player1,
            player_2=player2,
            status=Match.NOT_PLAYED
        )

@method_decorator(csrf_exempt, name='dispatch')
class EndMatchView(View):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            body = json.loads(request.body.decode('utf-8'))
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
    @staticmethod
    def set_winner(match: Match, winner: int):
        if match.player_1.user_id == winner:
            match.winner = match.player_1
        else:
            match.winner = match.player_2
        match.status = Match.FINISHED
        match.save()
    @staticmethod
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

@method_decorator(csrf_exempt, name='dispatch')    
class TournamentView(View): 
    @staticmethod
    def get(request: HttpRequest) -> JsonResponse:
        filter_params = TournamentView.get_filter_params(request)
        try:
            tournaments = Tournament.objects.filter(**filter_params)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        nb_tournaments = len(tournaments)

        tournaments_data = TournamentUtils.tournament_to_json(tournaments)

        response_data = {
            'nb_tournaments': nb_tournaments,
            'tournaments': tournaments_data
        }
        return JsonResponse(response_data, status=200)

    @staticmethod
    def post(request: HttpRequest) -> JsonResponse:
        try:
            json_request = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        valid_tournament, errors = TournamentView.is_valid_tournament(json_request)
        if not valid_tournament:
            return JsonResponse(data={'errors': errors}, status=400)
        is_private = json_request.get('is_private')
        user_id = json_request.get('user_id')
        tournament = Tournament(
            name=json_request['name'],
            is_private=is_private,
            admin_id=user_id
        )

        if is_private:
            tournament.password = make_password(json_request['password'])       #Crée une empreinte de mot de passe au format utilisé par cette application.

        tournament.type = Tournament.REMOTE
        max_players = json_request.get('max_players')
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
    
    @staticmethod
    def delete(request: HttpRequest) -> JsonResponse:
        try:
            json_request = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        user_id = json_request.get('user_id')

        try:
            user_tournaments = Tournament.objects.filter(admin_id=user_id, status=Tournament.CREATED)
            nb_tournaments = len(user_tournaments)
            if user_tournaments:
                user_tournaments.delete()

            player = Player.objects.filter(user_id=user_id, tournament__status=Tournament.CREATED)
            if player:
                player.delete()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        if nb_tournaments == 0:
            return JsonResponse({'message': 'No tournament created by this user'}, status=200)
        return JsonResponse({'message': 'Tournaments created by this user have been deleted'}, status=200)

    @staticmethod
    def register_admin_as_player(json_request, tournament: Tournament, user_id: int) -> Optional[list[str]]:
        admin_nickname = list(json_request.get('player_names'))
        if admin_nickname is not None:
            valid_nickname, nickname_errors = TournamentPlayersView.is_valid_nickname(admin_nickname[0])
            if not valid_nickname:
                return nickname_errors
            Player.objects.create(
                nickname=admin_nickname[0],
                user_id=user_id,
                tournament=tournament
            )
        return None

    @staticmethod
    def get_filter_params(request: HttpRequest) -> dict:
        filter_params = {}

        if 'display_private' not in request.GET:
            filter_params['is_private'] = False
        if 'display_completed' not in request.GET:
            filter_params['status__in'] = [Tournament.CREATED, Tournament.IN_PROGRESS]
        if 'display_all' not in request.GET:
            filter_params['type__in'] = [Tournament.REMOTE]

        return filter_params

    @staticmethod
    def is_valid_tournament(json_request: dict[str, Any]) -> tuple[bool, Optional[list[str]]]:
        errors = []
        name = json_request.get('name') 
        max_players = json_request.get('max_players')
        is_private = json_request.get('is_private')
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

    @staticmethod
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
    
    @staticmethod
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
    
    @staticmethod
    def is_valid_private(is_private: Any) -> tuple[bool, Optional[str]]:
        if is_private is None:
            return False, error.IS_PRIVATE_MISSING
        elif not isinstance(is_private, bool):
            return False, error.IS_PRIVATE_NOT_BOOL
        return True, None

    @staticmethod
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

@method_decorator(csrf_exempt, name='dispatch')
class TournamentPlayersView(View):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        players = tournament.players.all()

        players_data = [{
            'nickname': player.nickname,
            'user_id': player.user_id
        } for player in players]

        response_data = {
            'max_players': tournament.max_players,
            'nb_players': len(players),
            'players': players_data
        }

        return JsonResponse(response_data, status=200)

    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> JsonResponse:

        try:
            json_request = json.loads(request.body.decode('utf-8'))
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
    
    @staticmethod
    def delete(request: HttpRequest, tournament_id: int):
        try:
            json_request = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)
        
        user_id = json_request.get('user_id')

        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        try:
            player = tournament.players.get(user_id=user_id)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [error.NOT_REGISTERED]}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        if tournament.status != Tournament.CREATED:
            return JsonResponse({'errors': [error.CANT_LEAVE]}, status=403)

        try:
            player.delete()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        return JsonResponse({'message': f'You left the tournament `{tournament.name}`'}, status=200)

    @staticmethod
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
    
    @staticmethod
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

@method_decorator(csrf_exempt, name='dispatch')
class TournamentlocalView(View):
    @staticmethod
    def post(request: HttpRequest) -> JsonResponse:
        try:
            json_request = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        user_id = json_request.get('user_id')
        tournament = Tournament(
            name=json_request['name'],
            admin_id=user_id
        )
        

        max_players = json_request.get('max_players')
        if max_players is not None:
            tournament.max_players = max_players
        try:
            test=tournament.save()
            register_players_errors = TournamentlocalView.register_players_as_player(json_request, tournament)
            if register_players_errors is not None:
                tournament.delete()
                return JsonResponse({'errors': register_players_errors}, status=400)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        return JsonResponse(model_to_dict(tournament, exclude=['password']), status=201)
    
    @staticmethod
    def register_players_as_player(json_request, tournament: Tournament) -> Optional[list[str]]:
        player_names = list(json_request.get('player_names'))
        i=0
        for name in player_names:
            player = Player(nickname=name, user_id=i, tournament=tournament)
            i=+1
            try:
                player.save()
            except Exception as e:
                return JsonResponse({'errors': [f'An unexpected error occurred : {e}']}, status=500)
        return None

@method_decorator(csrf_exempt, name='dispatch')
class StartTournamentView(View):
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> JsonResponse:    
        try:
            json_request = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        user_id = json_request.get('user_id')
        try:
            tournament = Tournament.objects.get(id=tournament_id)
            players = tournament.players.all()
            matches = tournament.matches.all()
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        start_error = StartTournamentView.check_permissions(user_id, tournament, players, matches)
        if start_error is not None:
            return JsonResponse(data={'errors': [start_error]}, status=403)
                                
        tournament.status = Tournament.IN_PROGRESS
        tournament.start_datetime = datetime.datetime.now(datetime.UTC)

        try:
            tournament.save()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        return JsonResponse({'message': f'Tournament `{tournament.name}` successfully started'}, status=200)
    
    @staticmethod
    def check_permissions(user_id: int, tournament: Tournament, players, matches) -> Optional[str]:
        if tournament.status != Tournament.CREATED:
            return 'The tournament has already started'

        if tournament.admin_id != user_id:
            return 'You are not the owner of the tournament, so you cannot start it'

        if len(players) < settings.MIN_PLAYERS:
            return error.NOT_ENOUGH_PLAYERS

        if len(matches) != int(2 ** math.ceil(math.log2(len(players))) - 1):
            return error.MATCHES_NOT_GENERATED

        return None

@method_decorator(csrf_exempt, name='dispatch')
class ManageTournamentView(View):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        try:
            tournament_players = tournament.players.all()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        tournament_data = {
            'id': tournament.id,
            'name': tournament.name,
            'max_players': tournament.max_players,
            'nb_players': len(tournament_players),
            'players': [{
                'nickname': player.nickname,
                'user_id': player.user_id,
            } for player in tournament_players],
            'is_private': tournament.is_private,
            'status': TournamentUtils.status_to_string(tournament.status),
            'admin-id': tournament.admin_id
        }

        return JsonResponse(tournament_data, status=200)
    
    @staticmethod
    def delete(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            body = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        try:
            tournament = Tournament.objects.get(id=tournament_id)
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        tournament_name = tournament.name
        tournament_admin = tournament.admin_id
        user_id = body.get('user_id')
        if tournament_admin != user_id:
            return JsonResponse({
                'errors': [f'you cannot delete `{tournament_name}` because you are not the owner of the tournament']
            }, status=403)
        elif tournament.status == Tournament.IN_PROGRESS:
            return JsonResponse({
                'errors': [f'you cannot delete `{tournament_name}` because the tournament has already started']
            }, status=403)

        try:
            tournament.delete()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        return JsonResponse({'message': f'tournament `{tournament_name}` successfully deleted'}, status=200)
    
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> JsonResponse:
        try:
            body = json.loads(request.body.decode('utf-8'))
        except Exception:
            return JsonResponse(data={'errors': [error.BAD_JSON_FORMAT]}, status=400)

        try:
            tournament = Tournament.objects.get(id=tournament_id)
            tournament_players = tournament.players.all()
        except ObjectDoesNotExist:
            return JsonResponse({'errors': [f'tournament with id `{tournament_id}` does not exist']}, status=404)
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)
        
        user_id = body.get('user_id')
        manage_errors = ManageTournamentView.check_manage_permissions(user_id, tournament)
        if manage_errors is not None:
            return JsonResponse(data={'errors': manage_errors}, status=403)

        update_errors = ManageTournamentView.update_tournament_settings(body, tournament, tournament_players)
        if update_errors:
            return JsonResponse(data={'errors': update_errors}, status=400)

        try:
            tournament.save()
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        tournament_data = ManageTournamentView.get_tournament_data(tournament)
        return JsonResponse(tournament_data, status=200)
    
    @staticmethod
    def get_tournament_data(tournament: Tournament) -> dict[str, Any]:
        tournament_data = {
            'id': tournament.id,
            'name': tournament.name,
            'max_players': tournament.max_players,
            'is_private': tournament.is_private,
            'status': TournamentUtils.status_to_string(tournament.status),
        }
        return tournament_data

    @staticmethod
    def check_manage_permissions(user_id: int, tournament: Tournament) -> Optional[list[str]]:
        if tournament.status != Tournament.CREATED:
            return ['The tournament has already started, so you cannot update the settings']

        if tournament.admin_id != user_id:
            return ['You are not the owner of the tournament, so you cannot update the settings']

        return None
    
    @staticmethod
    def update_tournament_settings(body: dict, tournament: Tournament, tournament_players) -> Optional[list[str]]:
        update_errors = []

        new_name_errors = ManageTournamentView.update_tournament_name(body, tournament)
        new_max_players_error = ManageTournamentView.update_max_players(body, tournament, tournament_players)
        new_is_private_error = ManageTournamentView.update_is_private(body, tournament)
        new_password_error = ManageTournamentView.update_password(body, tournament)

        if new_name_errors is not None:
            update_errors.extend(new_name_errors)
        if new_max_players_error is not None:
            update_errors.append(new_max_players_error)
        if new_is_private_error is not None:
            update_errors.append(new_is_private_error)
        if new_password_error is not None:
            update_errors.append(new_password_error)

        return update_errors
    
    @staticmethod
    def update_tournament_name(body: dict, tournament: Tournament) -> Optional[list[str]]:
        new_name = body.get('name')
        if new_name is not None:
            valid_new_name, new_name_errors = TournamentView.is_valid_name(new_name)
            if not valid_new_name:
                return new_name_errors
            else:
                tournament.name = new_name
        return None

    @staticmethod
    def update_max_players(body: dict, tournament: Tournament, tournament_players) -> Optional[str]:
        new_max_players = body.get('max_players')
        if new_max_players is not None:
            valid_new_max_players, new_max_players_error = ManageTournamentView.is_valid_max_players(
                new_max_players, tournament_players)
            if not valid_new_max_players:
                return new_max_players_error
            else:
                tournament.max_players = new_max_players
        return None

    
    
    @staticmethod
    def update_is_private(body: dict, tournament: Tournament) -> Optional[str]:
        new_is_private = body.get('is_private')
        if new_is_private is not None:
            valid_is_private, is_private_error = TournamentView.is_valid_private(new_is_private)
            if not valid_is_private:
                return is_private_error
            else:
                tournament.is_private = new_is_private
        return None

    @staticmethod
    def is_valid_max_players(new_max_players: Any, tournament_players: Any) -> tuple[bool, Optional[str]]:
        valid_max_players, max_players_error = TournamentView.is_valid_max_players(new_max_players)
        if not valid_max_players:
            return False, max_players_error
        elif len(tournament_players) > new_max_players:
            return False, f'You cannot set the max players to {new_max_players} because there are already ' \
                          f'{len(tournament_players)} players registered'
        return True, None

    @staticmethod
    def update_password(body: dict, tournament: Tournament) -> Optional[str]:
        new_password = body.get('password')
        valid_password, password_error = TournamentView.is_valid_password(new_password)
        if tournament.is_private and (tournament.password is None or new_password is not None):
            if not valid_password:
                return password_error
            else:
                tournament.password = make_password(new_password)
        return None
    
@method_decorator(csrf_exempt, name='dispatch')
class DeleteInactiveTournamentView(View):
    @staticmethod
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

@method_decorator(csrf_exempt, name='dispatch')    
class MyTournamentAsPlayerView(View):
    @staticmethod
    def get(request: HttpRequest, user_id: int) -> JsonResponse:
        active_tournaments = []

        try:
            my_tournaments = Tournament.objects.filter(
                status__in=[Tournament.CREATED, Tournament.IN_PROGRESS],
                type__in=[Tournament.REMOTE, Tournament.LOCAL],
                players__user_id=user_id
            )
        except ObjectDoesNotExist:
            my_tournaments = []
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        if len(my_tournaments) > 0:
            active_tournaments.extend(my_tournaments)

        tournaments_data = TournamentUtils.tournament_to_json(active_tournaments)

        return JsonResponse(
            {
                'nb-active-tournaments': len(tournaments_data),
                'active-tournaments': tournaments_data
            },
            status=200
        )

@method_decorator(csrf_exempt, name='dispatch')    
class MyTournamentAsAdminView(View):
    @staticmethod
    def get(request: HttpRequest, user_id: int) -> JsonResponse:
        active_tournaments = []

        try:
            my_tournaments = Tournament.objects.filter(
                status__in=[Tournament.CREATED, Tournament.IN_PROGRESS],
                type__in=[Tournament.REMOTE, Tournament.LOCAL],
                admin_id=user_id
            )
        except ObjectDoesNotExist:
            my_tournaments = []
        except Exception as e:
            return JsonResponse({'errors': [str(e)]}, status=500)

        if len(my_tournaments) > 0:
            active_tournaments.extend(my_tournaments)

        tournaments_data = TournamentUtils.tournament_to_json(active_tournaments)

        return JsonResponse(
            {
                'nb-active-tournaments': len(tournaments_data),
                'active-tournaments': tournaments_data
            },
            status=200
        )
