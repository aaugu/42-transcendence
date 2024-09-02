from django.views import View
from django.http import HttpRequest
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

import requests, json

# Create your views here.


class GenerateMatchesView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/matches/generate/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/matches/generate/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)
    

class StartMatchView(APIView):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/match/start/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

class EndMatchView(APIView):
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/match/end/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

class TournamentView(APIView):
    @staticmethod
    def get(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/remote/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)
    
    @staticmethod
    def post(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/remote/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

class TournamentPlayersView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)
    @staticmethod
    def post(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)
    @staticmethod
    def delete(request: HttpRequest, tournament_id: int):
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/players/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

class TournamentlocalView(APIView):
    @staticmethod
    def post(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/local/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

class StartTournamentView(APIView):
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/start/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

class ManageTournamentView(APIView):
    @staticmethod
    def get(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)
    @staticmethod
    def delete(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)
    @staticmethod
    def patch(request: HttpRequest, tournament_id: int) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/" + str(tournament_id) + "/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)

class DeleteInactiveTournamentView(APIView):
    @staticmethod
    def delete(request: HttpRequest) -> Response:
        request_url = "http://172.20.2.2:10000/tournament/delete_inactive/"
        response = requests.get(url = request_url)
        if response.status_code == status.HTTP_200_OK:
            response_json = response.json()
            return Response({ "response": response_json}, status=status.HTTP_200_OK)
        else:
            return Response(status=response.status_code)
