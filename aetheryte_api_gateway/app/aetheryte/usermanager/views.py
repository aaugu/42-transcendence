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
        if check_autentication(request):
            users = CustomUser.objects.all()
            serializer = CustomUserSerializer(users, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"ERROR: ", "Unauthorized access"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        
    elif request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            new_user = CustomUser(
                username=serializer.validated_data['username'],
                nickname=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                is_2fa_enabled=False
            )
            new_user.set_password(request.data['password'])
            new_user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'PATCH', 'DELETE'])
def detailedUser(request, pk):
    if check_autentication(request):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
        
        if request.method == 'GET':
            serializer = CustomUserSerializer(user)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            serializer = CustomUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        elif request.method == 'DELETE':
            user.delete()
            return Response(status=status.HTTP_204_NO_CONTENT) 
    else:
        return Response({"ERROR: ", "Unauthorized access"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)