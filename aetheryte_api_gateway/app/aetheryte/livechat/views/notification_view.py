from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from login.models import CustomUser
from login.serializers import *
from livechat.views.utils import user_valid, user_exists
from usermanager.utils import check_authentication

# Notifications  
class NotificationView(APIView):
	def post(self, request):
		if not check_authentication(request):
			return Response(status=status.HTTP_401_UNAUTHORIZED)

		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		if not body['user_id'] or not body['target_id'] or not body['link']:
			return Response({'errors': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)
		
		user_id = body['user_id']
		target_id = body['target_id']
		if not user_valid(user_id) or not user_valid(target_id):
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)
		
		user_nickname = CustomUser.objects.filter(id=user_id).first().nickname
		target_nickname = CustomUser.objects.filter(id=target_id).first().nickname
		link = body['link']

		user_message = "You invited " + target_nickname + " to play with you\n" + link
		target_message = user_nickname + " invites you play to play a pong game\n" + link

		url = "http://172.20.5.2:8000/livechat/notification/"
		body = {
			"user_1": {
				"user_id": user_id,
				"message": user_message
			},
			"user_2": {
				"user_id": target_id,
				"message": target_message
			}
		}
		response = requests.post( url, json = body)
		try:
			response_json = response.json()
			return Response(response_json, status=response.status_code)
		except:
			return Response(status=response.status_code)

# # Body format of the request
# {
# 	"user_id": 1,
# 	"target_id": 2
# }
