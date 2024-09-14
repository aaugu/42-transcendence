from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests, json, pytz
from datetime import datetime

from django.db.models import Q
from livechat.models import Conversation, Message

class NotificationView(APIView):
	timezone = 'Europe/Zurich'

	def post(self, request):
		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		if 	not body['user_1']['user_id'] or not body['user_1']['message'] or \
			not body['user_2']['user_id'] or not body['user_2']['message']:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		status_code = self.create_notification(body['user_1']['user_id'], body['user_1']['message'])
		if status_code != status.HTTP_201_CREATED:
			return Response(status=status_code)
		return Response(status=status.HTTP_201_CREATED)

		status_code = self.create_notification(body['user_2']['user_id'], body['user_2']['message'])
		if status_code != status.HTTP_201_CREATED:
			return Response(status=status_code)

		return Response(status=status.HTTP_201_CREATED)

	def create_notification(self, user_id, message):
		conv = Conversation.objects.get(user_1=user_id, user_2=user_id)
		if not conv:
			status_code = self.create_self_conversation(user_id)
			if status_code != status.HTTP_201_CREATED:
				return status_code
		
		conv = Conversation.objects.get(user_1=user_id, user_2=user_id)
		if not conv:
			return status.HTTP_422_UNPROCESSABLE_ENTITY
		
		actual_timezone = pytz.timezone(self.timezone)
		now = datetime.now()
		timestamp = actual_timezone.localize(now)

		date = timestamp.strftime("%Y-%m-%d")
		time = timestamp.strftime("%H:%M")

		notification = Message(conversation=conv, author=user_id, message=message, date=date, time=time)
		notification.save()
		if self.notification_exists(conv, user_id, message, date, time):
			return status.HTTP_201_CREATED

		return status.HTTP_422_UNPROCESSABLE_ENTITY

	def create_self_conversation(self, user_id):
		conversation = Conversation(
			user_1 = user_id,
			user_2 = user_id,
		)
		conversation.save()

		conv = Conversation.objects.get(user_1=user_id, user_2=user_id)
		if conv:
			return status.HTTP_201_CREATED
		return status.HTTP_422_UNPROCESSABLE_ENTITY

	def notification_exists(self, conversation, author, message, date, time):
		message = Message.objects.filter(conversation=conversation, author=author, message=message, date=date, time=time)
		if message:
			return True
		return False

# {
#     "user_1": {
#         "user_id": 1,
#         "message": "bouh"
#     },
#     "user_2": {
#         "user_id": 2,
#         "message": "coucou"
#     }
# }