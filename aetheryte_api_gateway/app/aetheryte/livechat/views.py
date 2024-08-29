from django.shortcuts import render
from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

import requests, json

from login.models import CustomUser

# Remove after
from colorama import Fore, Style
def dprint(msg):
    full_msg = "DEBUG ==> " + str(msg)
    colored_msg = Fore.YELLOW + full_msg + Style.RESET_ALL
    print(colored_msg)
#

@api_view(['GET', 'POST'])
def conversationViewSet(request, pk):
	# GET: conversations involving current user
	if request.method == 'GET':
		if not user_valid(pk):
			return Response(status=status.HTTP_404_NOT_FOUND)
		
		request_url = "http://172.20.5.2:8000/livechat/" + str(pk) + "/conversations/"
		response = requests.get(url = request_url)
		if response.status_code == status.HTTP_200_OK:
			response_json = response.json()
			return Response({ "response": response_json}, status=status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_404_NOT_FOUND)

	# POST: create conversation with two users
	elif request.method == 'POST':
		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		if not body['target_id']:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		user_id = pk
		target_id = body['target_id']
		if not user_valid(user_id) or not user_valid(target_id):
			return Response(status=status.HTTP_404_NOT_FOUND)

		url = "http://172.20.5.2:8000/livechat/" + str(user_id) + "/conversations/"
		body = {
			"user_1": user_id,
			"user_2": target_id
		}
		response = requests.post( url, json = body)
		return Response(status=response.status_code)

def user_valid(user_id):
	user = CustomUser.objects.filter(Q(id=user_id))
	if user:
		return True
	return False