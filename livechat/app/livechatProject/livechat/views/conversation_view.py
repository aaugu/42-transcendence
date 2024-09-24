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
				return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

		conversations = Conversation.objects.filter(Q(user_1=user_id) | Q(user_2=user_id))
		serializer = ConversationSerializer(conversations, many=True)

		return Response({ "conversations": serializer.data }, status=status.HTTP_200_OK)
	
	# POST: create conversation with two users
	def post(self, request, user_id):	
		serializer = ConversationSerializer(data=request.data)
		if serializer.is_valid():
			user_id = serializer.validated_data['user_1']
			target_id = serializer.validated_data['user_2']
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		status_code = self.create_conversation(user_id, target_id)
		if status_code == status.HTTP_201_CREATED:
			conversation_id = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))[0].id
			return Response({ "conversation_id": conversation_id}, status=status_code)
		return Response(status=status_code)
	
	# Create conversation
	def create_conversation(self, user_id, target_id):
		if self.conversation_exists(user_id, target_id):
			return status.HTTP_409_CONFLICT

		if not user_exists(target_id):
			if not create_user(target_id):
				return status.HTTP_500_INTERNAL_SERVER_ERROR

		conversation = Conversation(
			user_1 = user_id,
			user_2 = target_id,
		)
		conversation.save()
		check_conversation = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))
		if not check_conversation:
			return status.HTTP_500_INTERNAL_SERVER_ERROR
		return status.HTTP_201_CREATED

	# Check if conversation exists
	def conversation_exists(self, user_id, target_id):
		conversation_1 = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))
		conversation_2 = Conversation.objects.filter(Q(user_1=target_id) & Q(user_2=user_id))
		if conversation_1 or conversation_2:
			return True
		return False
