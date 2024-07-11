from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404

import requests

from login.models import *
from login.serializers import *
from login.utils import dprint

from .utils import *

@api_view(['GET', 'POST'])
def generalUser(request):
    if request.method == 'GET':
        response = requests.get('http://172.20.1.2:8000/api/user/')

        if response.status_code == 200:
            data = response.json()
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = response.json()
            return Response(data, status=response.status_code)
    elif request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            new_user = CustomUser(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                is_2fa_enabled=False
            )
            new_user.set_password(request.data['password'])
            new_user.save()

            response = requests.post('http://172.20.1.2:8000/api/user/', {
                "username": request.data['username'],
                "nickname": request.data['username'],
                "email": request.data['email']
            })
            data = response.json()
            return Response(data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'PATCH', 'DELETE'])
def detailedUser(request, pk):
    try:
        user = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'GET':
        response = requests.get('http://172.20.1.2:8000/api/user/' + str(pk))
        if response.status_code == 200:
            data = response.json()
            return Response(data, status=status.HTTP_200_OK)
        else:
            data = response.json()
            return Response(data, status=response.status_code)
        
    elif request.method == 'PATCH':
        serializer = CustomUserSerializer(user, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            dprint(request.data)
        try:
            response = requests.patch(f'http://172.20.1.2:8000/api/user/{pk}/', json=request.data)
            # response.raise_for_status()  # Lève une exception pour les erreurs HTTP
            data = response.json()
            return Response(data, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.method == 'DELETE':
        user = get_object_or_404(CustomUser, id=pk)
        user.delete()
        response = requests.delete(f'http://172.20.1.2:8000/api/user/{pk}/')
        data = response.json()
        return Response(data, status=status.HTTP_200_OK)
    else:
        return Response({"status": "WIP"}, status=status.HTTP_200_OK)