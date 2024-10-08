
from django.http import HttpRequest
from rest_framework.response import Response
from rest_framework.views import APIView


import requests, json
from login import utils

# Create your views here.


class GenerateMatchesView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/matches/generate/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)

    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/matches/generate/"
        response = requests.post(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)

class StartMatchView(APIView):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/match/start/"
        json_request = json.loads(request.body.decode('utf-8'))
        json_request['user_jwt'] = utils.get_user_from_jwt(request)
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)

class EndMatchView(APIView):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/match/end/"
        json_request = json.loads(request.body.decode('utf-8'))
        json_request['user_jwt'] = utils.get_user_from_jwt(request)
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)

class TournamentView(APIView):
    @staticmethod
    def get(request: HttpRequest) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        request_url = "http://172.20.2.2:10000/tournament/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)
    
    @staticmethod
    def post(request: HttpRequest) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        if not utils.check_user_jwt_vs_user_body(request, 'user_id'):
            return Response('errors: access denied', status=403)
        request_url = "http://172.20.2.2:10000/tournament/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)

class TournamentPlayersView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response({response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)
        
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        if not utils.check_user_jwt_vs_user_body(request, 'user_id'):
            return Response('errors: access denied', status=403)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)

class StartTournamentView(APIView):
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        if not utils.check_user_jwt_vs_user_body(request, 'user_id'):
            return Response('errors: access denied', status=403)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/start/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.patch(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)

class ManageTournamentView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)
        
    @staticmethod
    def delete(request: HttpRequest, tournament_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        if not utils.check_user_jwt_vs_user_body(request, 'user_id'):
            return Response('errors: access denied', status=403)
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.delete(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)
        
class MyTournamentAsAdminView(APIView):
    @staticmethod
    def get(request: HttpRequest, user_id: int) -> Response:
        if not utils.check_authentication(request):
            return Response('errors: access denied', status=401)
        if not utils.check_user_jwt_vs_user_url(request, user_id):
            return Response('errors: access denied', status=403)
        request_url = "http://172.20.2.2:10000/tournament/" + str(user_id) + "/mytournament/admin/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response(response_json, status=response.status_code)
        else:
            return Response(status=response.status_code)