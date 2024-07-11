from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import CustomUser
from .serializers import CustomUserSerializer

from .utils import *

@api_view(['GET', 'POST'])
def general_user(request):
    if request.method == 'GET':
            user = CustomUser.objects.all()
            serial = CustomUserSerializer(user, many=True)
            return Response(serial.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
def detailed_user(request, pk):
    try:
        user = CustomUser.objects.get(pk=pk)
    except CustomUser.DoesNotExist:
        return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = CustomUserSerializer(user, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)