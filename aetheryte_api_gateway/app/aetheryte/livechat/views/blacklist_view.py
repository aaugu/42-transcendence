from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from login.models import CustomUser
from login.serializers import *
from livechat.views.utils import user_valid
from usermanager.utils import check_authentication
from login.utils import get_user_from_jwt

class BlacklistView(APIView):
	# GET : check if user is blacklisted by user
	def get(self, request, user_id, target):
		try:
			if not check_authentication(request):
				return Response(status=status.HTTP_401_UNAUTHORIZED)
			
			jwt_user_id = get_user_from_jwt(request)
			if jwt_user_id != user_id:
				return Response(status=status.HTTP_403_FORBIDDEN)
		except:
			return Response(status=status.HTTP_401_UNAUTHORIZED)

		if not user_valid(user_id) or not user_valid(target):
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)
		
		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/blacklist/" + str(target)
		response = requests.get(url)
		response_json = response.json()

		if response.status_code == status.HTTP_200_OK:
			return Response({ "is_blacklisted": response_json['is_blacklisted'] }, status=status.HTTP_200_OK)
		else:
			return Response(status=response.status_code)

	# POST: add target user to blacklist
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
			if not body['target_id']:
				return Response({'errors': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
			target_id = body['target_id']
			if target_id == user_id:
				return Response({'errors': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
		except:
			return Response({'errors': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

		if not user_valid(user_id) or not user_valid(target_id):
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)

		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/blacklist/"
		body = {
			"blacklisted_id": target_id
		}
		response = requests.post( url, json = body)
		try:
			response_json = response.json()
			return Response(response_json, status=response.status_code)
		except:
			return Response(status=response.status_code)

	# DELETE: unblacklist a user
	def delete(self, request, user_id, target):
		try:
			if not check_authentication(request):
				return Response(status=status.HTTP_401_UNAUTHORIZED)
			
			jwt_user_id = get_user_from_jwt(request)
			if jwt_user_id != user_id:
				return Response(status=status.HTTP_403_FORBIDDEN)
		except:
			return Response(status=status.HTTP_401_UNAUTHORIZED)

		if not user_valid(user_id) or not user_valid(target):
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)
		
		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/blacklist/" + str(target)
		response = requests.delete(url)
		try:
			response_json = response.json()
			return Response(response_json, status=response.status_code)
		except:
			return Response(status=response.status_code)