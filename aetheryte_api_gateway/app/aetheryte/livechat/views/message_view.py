from django.db.models import Q

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from login.models import CustomUser
from login.serializers import *
from usermanager.utils import check_authentication

# Messages : get all messages from a conversation
class MessageView(APIView):
	def get(self, request, user_id, conversation_id):
		if not check_authentication(request):
			return Response(status=status.HTTP_401_UNAUTHORIZED)

		request_url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/conversation/" + str(conversation_id) + "/messages/"
		response = requests.get(url = request_url)
		
		if response.status_code == status.HTTP_200_OK:
			response_json = response.json()
			conversation = response_json['conversation']
			user_1_id = conversation['user_1']
			user_2_id = conversation['user_2']
			
			users = CustomUser.objects.filter(Q(id=user_1_id) | Q(id=user_2_id))
			users_serializer = CustomUserSerializer(users, many=True)

			return Response({	
								"messages": response_json['messages'],
								"users": users_serializer.data,
								"contact_blacklisted": response_json['contact_blacklisted']
							},
							status=status.HTTP_200_OK)
		else:
			try:
				response_json = response.json()
				return Response(response_json, status=response.status_code)
			except:
				return Response(status=response.status_code)