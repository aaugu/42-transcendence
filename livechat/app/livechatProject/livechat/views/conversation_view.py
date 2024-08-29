from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from livechat.models import User, Conversation
from livechat.serializers import UserSerializer, ConversationSerializer

# Conversations  
class ConversationView(APIView):
	# GET: conversations involving current user
	def get(self, request, pk):
		if not self.user_exists(pk):
			if not self.create_user(pk):
				return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

		conversations = Conversation.objects.filter(Q(user_1=pk) | Q(user_2=pk))
		serializer = ConversationSerializer(conversations, many=True)

		return Response({ "conversations": serializer.data }, status=status.HTTP_200_OK)
	
	# POST: create conversation with two users
	def post(self, request, pk):	
		serializer = ConversationSerializer(data=request.data)
		if serializer.is_valid():
			user_id = serializer.validated_data['user_1']
			target_id = serializer.validated_data['user_2']
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		status_code = self.create_conversation(user_id, target_id)
		return Response(status=status_code)
	
	# Create conversation
	def create_conversation(self, user_id, target_id):
		if self.conversation_exists(user_id, target_id):
			return 409
		else:
			if not self.user_exists(target_id):
				if not self.create_user(target_id):
					return 422

			conversation = Conversation(
				user_1 = user_id,
				user_2 = target_id,
			)
			conversation.save()
			check_conversation = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))
			if not check_conversation:
				return 422
			return 201

	# Check if conversation exists
	def conversation_exists(self, user_id, target_id):
		conversation_1 = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))
		conversation_2 = Conversation.objects.filter(Q(user_1=target_id) & Q(user_2=user_id))
		if conversation_1 or conversation_2:
			return True
		return False

	# Check if user exists
	def user_exists(self, user_id):
		user = User.objects.filter(Q(user_id=user_id))

		if user:
			return True
		return False
	
	# Create user
	def create_user(self, user_id):
		user = User(user_id=user_id)
		user.save()

		user_created = User.objects.filter(Q(user_id=user_id))
		return user_created


# @api_view(['GET', 'POST'])
# def conversationViewSet(request, pk):
# 	# GET: conversations involving current user
# 	if request.method == 'GET':
# 		if not user_exists(pk):
# 			if not create_user(pk):
# 				return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

# 		conversations = Conversation.objects.filter(Q(user_1=pk) | Q(user_2=pk))
# 		serializer = ConversationSerializer(conversations, many=True)

# 		return Response({ "conversations": serializer.data }, status=status.HTTP_200_OK)

# 	# POST: create conversation with two users
# 	elif request.method == 'POST':
# 		body_unicode = request.body.decode('utf-8')
# 		body = json.loads(body_unicode)
# 		print(body)
# 		serializer = ConversationSerializer(data=request.data)
# 		if serializer.is_valid():
# 			user_id = serializer.validated_data['user_1']
# 			target_id = serializer.validated_data['user_2']
# 		else:
# 			return Response(status=status.HTTP_400_BAD_REQUEST)
		
# 		status_code = create_conversation(user_id, target_id)
# 		return Response(status=status_code)
