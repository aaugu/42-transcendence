from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from login.models import CustomUser
from login.serializers import *
from livechat.views.utils import user_valid, user_exists
from usermanager.utils import check_authentication
from login.utils import get_user_from_jwt

# Conversations  
class ConversationView(APIView):
	# GET: conversations involving current user
	def get(self, request, user_id):
		try:
			if not check_authentication(request):
				return Response(status=status.HTTP_401_UNAUTHORIZED)
			
			jwt_user_id = get_user_from_jwt(request)
			if jwt_user_id != user_id:
				return Response(status=status.HTTP_403_FORBIDDEN)
		except:
			return Response(status=status.HTTP_401_UNAUTHORIZED)

		if not user_valid(user_id):
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)

		request_url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/conversations/"
		response = requests.get(url = request_url)

		if response.status_code == status.HTTP_200_OK:
			response_json = response.json()
			users = self.get_users_from_conversations(response_json['conversations'])
			return Response({ "conversations": response_json['conversations'], "users": users }, status=status.HTTP_200_OK)
		else:
			try:
				response_json = response.json()
				return Response(response_json, status=response.status_code)
			except:
				return Response(status=response.status_code)
	
	# POST: create conversation with two users
	def post(self, request, user_id):
		try:
			if not check_authentication(request):
				return Response(status=status.HTTP_401_UNAUTHORIZED)
			
			jwt_user_id = get_user_from_jwt(request)
			if jwt_user_id != user_id:
				return Response(status=status.HTTP_403_FORBIDDEN)
		except:
			return Response(status=status.HTTP_401_UNAUTHORIZED)

		try:
			body_unicode = request.body.decode('utf-8')
			body = json.loads(body_unicode)
			if not body['nickname']:
				return Response({'errors': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
			nickname = body['nickname']
		except:
			return Response({'errors': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

		if not user_exists(nickname):
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)

		target_id = CustomUser.objects.filter(nickname=nickname).first().id

		if not user_valid(user_id) or not user_valid(target_id):
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)

		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/conversations/"
		body = {
			"user_1": user_id,
			"user_2": target_id
		}
		response = requests.post( url, json = body)
		if response.status_code == status.HTTP_201_CREATED:
			response_json = response.json()
			return Response({"conversation_id": response_json['conversation_id']}, status=response.status_code)
		else:
			try:
				response_json = response.json()
				return Response(response_json, status=response.status_code)
			except:
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
