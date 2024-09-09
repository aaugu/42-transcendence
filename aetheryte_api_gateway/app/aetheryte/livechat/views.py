from django.shortcuts import render
from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from login.models import CustomUser
from login.serializers import *
from .utils import user_valid, user_exists

# Conversations  
class ConversationView(APIView):
	# GET: conversations involving current user
	def get(self, request, pk):
		if not user_valid(pk):
			return Response(status=status.HTTP_404_NOT_FOUND)

		request_url = "http://172.20.5.2:8000/livechat/" + str(pk) + "/conversations/"
		response = requests.get(url = request_url)
		response_json = response.json()
		users = self.get_users_from_conversations(response_json['conversations'])

		if response.status_code == status.HTTP_200_OK:
			return Response({ "conversations": response_json['conversations'], "users": users }, status=status.HTTP_200_OK)
		else:
			return Response(status=response.status_code)
	
	# POST: create conversation with two users
	def post(self, request, pk):
		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		if not body['nickname']:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		nickname = body['nickname']
		if not user_exists(nickname):
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		user_id = pk
		target_id = CustomUser.objects.filter(nickname=nickname).first().id

		if not user_valid(user_id) or not user_valid(target_id):
			return Response(status=status.HTTP_404_NOT_FOUND)

		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/conversations/"
		body = {
			"user_1": user_id,
			"user_2": target_id
		}
		response = requests.post( url, json = body)
		if response.status_code == status.HTTP_201_CREATED:
			response_json = response.json()
			return Response({"conversation_id": response_json['conversation_id']}, status=response.status_code)
		
		return Response(status=response.status_code)
	
	# Get users concerned by conversations
	def get_users_from_conversations(self, conversations):
		user_ids = []
		for conversation in conversations:
			if conversation['user_1'] not in user_ids:
				user_ids.append(conversation['user_1'])
			if conversation['user_2'] not in user_ids:
				user_ids.append(conversation['user_2'])

		sorted_ids = sorted(user_ids)
		users = CustomUser.objects.filter(id__in=sorted_ids)
		serializer = CustomUserSerializer(users, many=True)
		
		return serializer.data

# Messages : get all messages from a conversation
class MessageView(APIView):
	def get(self, request, pk):

		request_url = "http://172.20.5.2:8000/livechat/conversation/" + str(pk) + "/messages/"
		response = requests.get(url = request_url)
		
		if response.status_code == status.HTTP_200_OK:
			response_json = response.json()
			conversation = response_json['conversation'][0]
			user_1_id = conversation['user_1']
			user_2_id = conversation['user_2']
			
			users = CustomUser.objects.filter(Q(id=user_1_id) | Q(id=user_2_id))
			users_serializer = CustomUserSerializer(users, many=True)

			return Response({ "messages": response_json['messages'], "users": users_serializer.data }, status=status.HTTP_200_OK)
		else:
			return Response(status=response.status_code)
		
class BlacklistView(APIView):
	# POST: add target user to blacklist
	def post(self, request, pk):
		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		if not body['target_id']:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		target_id = body['target_id']
		if not user_valid(pk) or not user_valid(target_id):
			return Response(status=status.HTTP_404_NOT_FOUND)

		url = "http://172.20.5.2:8000/livechat/" + str(pk) + "/blacklist/"
		body = {
			"blacklisted_id": target_id
		}
		response = requests.post( url, json = body)

		return Response(status=response.status_code)

	# DELETE: unblacklist a user
	def delete(self, request, pk, target):
		if not user_valid(pk) or not user_valid(target):
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		url = "http://172.20.5.2:8000/livechat/" + str(pk) + "/blacklist/" + str(target)
		response = requests.delete(url)

		return Response(status=response.status_code)