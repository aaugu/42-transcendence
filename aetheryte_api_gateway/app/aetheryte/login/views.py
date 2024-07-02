from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view

from .serializers import CustomTokenObtainPairSerializer

import json

from .utils import *

@api_view(['GET', 'POST'])
def general_user(request):
    
        if request.method == 'GET':
            if check_autentication(request):
                http_response = make_request('GET', 'http://localhost:8001/micro/usermanager/', None)
                if http_response != False:
                    return Response(http_response.json(), status=status.HTTP_200_OK)
                else:
                    return Response({"ERROR": "Invalid http type"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"ERROR : No token in cookies, please redirect user to the login"}, status=status.HTTP_401_UNAUTHORIZED)
        
        elif request.method == 'POST':
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return Response({"ERROR : Invalid JSON in your request"}, status=status.HTTP_400_BAD_REQUEST)
            
            # creation utilisateur dans l'etherite
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            if not all([username, email, password]):
                return Response({"ERROR": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({"ERROR": "User already exists"}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(username=username, email=email, password=password)

            # creation utilisateur dans le microservice de gestion utilisateur
            payload = {
                "nickname": data.get('nickname'),
                "username": data.get('username'),
                "email": data.get('email')
            }

            http_response = make_request('POST', 'http://localhost:8001/micro/usermanager/', payload)
            if http_response != False:  
                return Response(http_response.json(), status=status.HTTP_200_OK)
            else:
                return Response({"ERROR": "Invalid http type"}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def detail_user(request, pk):
    if check_autentication(request):
        url = 'http://localhost:8001/micro/usermanager/' + str(pk) + '/'

        if request.method == 'GET':
            http_response = make_request('GET', url, None)
            if http_response != False:
                return Response(http_response.json(), status=status.HTTP_200_OK)
            else:
                return Response({"ERROR": "This user wasn't created on usermanager micro services"}, status=status.HTTP_400_BAD_REQUEST)
            
        elif request.method == 'PUT':
                return Response({"ERROR": "Not yet implemented"}, status=status.HTTP_404_NOT_FOUND)
        
        elif request.method == 'PATCH':
            user = make_request('GET', url, None)
            data = json.loads(request.body)
            payload = create_payload(user, data)
            http_response = make_request('PATCH', url, payload)
            return Response({"response" : http_response.json()}, status=status.HTTP_404_NOT_FOUND)
        
        elif request.method == 'DELETE':
            try:
                user = User.objects.get(pk=pk)
                user.delete()
                http_response = make_request('DELETE', url, None)
                return Response({"SUCCESS": "User deleted"}, status=status.HTTP_204_NO_CONTENT)
            except User.DoesNotExist or http_response == False:
                return Response({"ERROR": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    else:
         return Response({"ERROR : No token in cookies, please redirect user to the login"}, status=status.HTTP_401_UNAUTHORIZED)