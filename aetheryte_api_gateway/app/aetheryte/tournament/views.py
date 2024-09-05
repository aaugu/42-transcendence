from django.views import View
from django.http import HttpRequest
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

import requests, json

# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class GenerateMatchesView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/matches/generate/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/matches/generate/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')    
class StartMatchView(APIView):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/match/start/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')
class EndMatchView(APIView):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/match/end/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')
class TournamentView(APIView):
    @staticmethod
    def get(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/remote/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)
    
    @staticmethod
    def post(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/remote/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')
class TournamentPlayersView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)
        
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)
        
    @staticmethod
    def delete(request: HttpRequest, tournament_id: int):
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.delete(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')
class TournamentlocalView(APIView):
    @staticmethod
    def post(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/local/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.post(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:

            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')
class StartTournamentView(APIView):
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/start/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.patch(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')
class ManageTournamentView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        response = requests.get(url = request_url)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)
        
    @staticmethod
    def delete(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.delete(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)
        
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.patch(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)

@method_decorator(csrf_exempt, name='dispatch')
class DeleteInactiveTournamentView(APIView):
    @staticmethod
    def delete(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/delete_inactive/"
        json_request = json.loads(request.body.decode('utf-8'))
        response = requests.delete(url = request_url, json = json_request)
        if response.json() is not None:
            response_json = response.json()
            return Response({ "response": response_json}, status=response.status_code)
        else:
            return Response(status=response.status_code)