from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from livechat.models import User, Conversation, Message, Blacklist
from livechat.serializers import UserSerializer, ConversationSerializer, MessageSerializer

# Users
class ListUsers(APIView):
	def get(self, request, format=None):
		users = User.objects.all()
		serializer = UserSerializer(users, many=True)
		return Response({"users": serializer.data }, status=status.HTTP_200_OK)

# @api_view(['GET', 'POST'])
# def userViewSet(request):
# 	# GET users
# 	if request.method == 'GET':
# 		users = User.objects.all()
# 		serializer = UserSerializer(users, many=True)
# 		return Response({"users": serializer.data }, status=status.HTTP_200_OK)