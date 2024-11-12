from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from livechat.models import User, Conversation
from livechat.serializers import UserSerializer, ConversationSerializer
from livechat.views.utils import user_exists, create_user

# Conversations
class ConversationView(APIView):
	# GET: conversations involving current user
	def get(self, request, user_id):
		if not user_exists(user_id):
			if not create_user(user_id):
				return Response({'errors': "Could not create conversation"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

		try:
			user = User.objects.get(user_id=user_id)
		except:
			return Response({'errors': "User not found"}, status=status.HTTP_404_NOT_FOUND)
		conversations = Conversation.objects.filter(Q(user_1=user) | Q(user_2=user))
		serializer = ConversationSerializer(conversations, many=True)

		return Response({ "conversations": serializer.data }, status=status.HTTP_200_OK)

	# POST: create conversation with two users
	def post(self, request, user_id):
		serializer = ConversationSerializer(data=request.data)
		if serializer.is_valid():
			user_id = serializer.validated_data['user_1']
			target_id = serializer.validated_data['user_2']
		else:
			return Response({'errors': "Bad request"}, status=status.HTTP_400_BAD_REQUEST)

		status_code = self.create_conversation(user_id, target_id)
		if status_code == status.HTTP_201_CREATED:
			conversation_id = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))[0].id
			return Response({ "conversation_id": conversation_id}, status=status_code)
		return Response({'errors': "Could not create conversation or conversation already exists"}, status=status_code)

	# Create conversation
	def create_conversation(self, user_id, target_id):
		if not user_exists(target_id):
			if not create_user(target_id):
				return status.HTTP_422_UNPROCESSABLE_ENTITY

		try:
			user = User.objects.get(user_id=user_id)
			target = User.objects.get(target=user_id)
		except:
			return status.HTTP_404_NOT_FOUND

		if self.conversation_exists(user, target):
			return status.HTTP_409_CONFLICT

		conversation = Conversation(
			user_1 = user,
			user_2 = target,
		)
		conversation.save()
		check_conversation = Conversation.objects.filter(Q(user_1=user) & Q(user_2=target))
		if not check_conversation:
			return status.HTTP_422_UNPROCESSABLE_ENTITY
		return status.HTTP_201_CREATED

	# Check if conversation exists
	def conversation_exists(self, user, target):
		conversation_1 = Conversation.objects.filter(Q(user_1=user) & Q(user_2=target))
		conversation_2 = Conversation.objects.filter(Q(user_1=target) & Q(user_2=user))
		if conversation_1 or conversation_2:
			return True
		return False
