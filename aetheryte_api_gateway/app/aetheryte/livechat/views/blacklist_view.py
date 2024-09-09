from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from login.models import CustomUser
from login.serializers import *
from livechat.views.utils import user_valid

class BlacklistView(APIView):
	# POST: add target user to blacklist
	def post(self, request, user_id):
		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		if not body['target_id']:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		target_id = body['target_id']
		if not user_valid(user_id) or not user_valid(target_id):
			return Response(status=status.HTTP_404_NOT_FOUND)

		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/blacklist/"
		body = {
			"blacklisted_id": target_id
		}
		response = requests.post( url, json = body)

		return Response(status=response.status_code)

	# DELETE: unblacklist a user
	def delete(self, request, user_id, target):
		if not user_valid(user_id) or not user_valid(target):
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/blacklist/" + str(target)
		response = requests.delete(url)

		return Response(status=response.status_code)