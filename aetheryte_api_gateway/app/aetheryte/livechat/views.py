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

# Conversations  
class ConversationView(APIView):
	# GET: conversations involving current user
	def get(self, request, pk):
		if not user_valid(pk):
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		request_url = "http://172.20.5.2:8000/livechat/" + str(pk) + "/conversations/"
		response = requests.get(url = request_url)
		if response.status_code == status.HTTP_200_OK:
			response_json = response.json()
			return Response({ "response": response_json}, status=status.HTTP_200_OK)
		else:
			return Response(status=response.status_code)
	
	# POST: create conversation with two users
	def post(self, request, pk):
		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		if not body['target_id']:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		user_id = pk
		target_id = body['target_id']

		if not self.user_valid(user_id) or not self.user_valid(target_id):
			return Response(status=status.HTTP_404_NOT_FOUND)

		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/conversations/"
		body = {
			"user_1": user_id,
			"user_2": target_id
		}
		response = requests.post( url, json = body)
		return Response(status=response.status_code)
	
	# Check if user is valid
	def user_valid(self, user_id):
		user = CustomUser.objects.filter(Q(id=user_id))
		if user:
			return True
		return False

# Messages : get all messages from a conversation
class MessageView(APIView):
	def get(self, request, pk):
		request_url = "http://172.20.5.2:8000/livechat/conversation/" + str(pk) + "/messages/"
		response = requests.get(url = request_url)
		if response.status_code == status.HTTP_200_OK:
			response_json = response.json()
			return Response({ "response": response_json}, status=status.HTTP_200_OK)
		else:
			return Response(status=response.status_code)
