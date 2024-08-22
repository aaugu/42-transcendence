from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

import requests

from livechat.models import User, Conversation, Message, Blacklist
from livechat.serializers import UserSerializer, ConversationSerializer, MessageSerializer

# Users
@api_view(['GET', 'POST'])
def userViewSet(request):
	# GET users
	if request.method == 'GET':
		users = User.objects.all()
		serializer = UserSerializer(users, many=True)
		return Response({"users": serializer.data, }, status=status.HTTP_200_OK)

# Conversations  
@api_view(['GET', 'POST'])
def conversationViewSet(request, pk):
	# GET: conversations involving current user
	if request.method == 'GET':
		# if not is_user_valid(pk):
		#     return Response(status=status.HTTP_404_NOT_FOUND)
		current_user = User.objects.filter(Q(user_id=pk))
		if not current_user:
			if not create_user(pk):
				return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

		conversations = Conversation.objects.filter(Q(user_1=pk) | Q(user_2=pk))
		serializer = ConversationSerializer(conversations, many=True)

		return Response({ "conversations": serializer.data, }, status=status.HTTP_200_OK)

	# POST: create conversation with two users
	elif request.method == 'POST':
		# user_id = request.body.user_id
		# if not (is_user_valid(user_id) | is_user_valid(target_id)):
		#     return Response(status=status.HTTP_404_NOT_FOUND)

		response = create_conversation(request)
		if  response == 400:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		elif response == 422:
			return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
		elif response == 201:
			return Response(status=status.HTTP_201_OK)

# Messages : get all messages from a conversation
@api_view(['GET'])
def messageViewSet(request, pk):        
	messages = Message.objects.filter(Q(conversation_id=pk))
	if not messages:
		return Response(status=status.HTTP_404_NOT_FOUND)

	serializer = MessageSerializer(messages, many=True)
	return Response(serializer.data)

# Blacklist
@api_view(['POST', 'DELETE'])
def blacklistViewSet(request):
	initiator = User.objects.filter(Q(user_id=request.user_id))
	if not initiator:
		return Response(status=status.HTTP_404_NOT_FOUND)
	target = User.objects.filter(Q(user_id=request.target_id))
	if not target:
		return Response(status=status.HTTP_404_NOT_FOUND)

	# POST: Blacklist a user
	if request.method == 'POST':
		if not blacklist_user(initiator, target):
			return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
		else:
			return Response( status=status.HTTP_204_NO_CONTENT )
	# DELETE: Remove an other user from current user blacklist
	elif request.method == 'DELETE':
		return remove_user_from_blacklist(initiator, target)

# Utils
def is_user_valid(user_id):
	user = "http://172.20.0.2/api/user/" + str(user_id)
	response = requests.get(user)
	if response.status_code == 404:
		return False
	return True

def create_user(user_id):
	user = User(user_id)
	user.save()

	new_user = User.objects.filter(Q(user_id=user_id))
	return new_user

def create_conversation(request):
	serializer = ConversationSerializer(data=request.data)
	if serializer.is_valid():
		target_id = serializer.validated_data['user_2']
		target = User.objects.filter(Q(user_id=target_id))
		if not target:
			if not create_user(target_id):
				return 422

		conversation = Conversation(
			user_1 = serializer.validated_data['user_1'],
			user_2 = serializer.validated_data['user_2'],
		)
		conversation.save()
		check_conversation = Conversation.objects.filter(Q(user_1=serializer.validated_data['user_1']) & Q(user_2=serializer.validated_data['user_2']))
		if not check_conversation:
			return 422
		return 201

	else:
		return 400

def blacklist_user(initiator, target):
	blacklist = Blacklist(initiator, target)
	blacklist.save()

	new_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))
	return new_blacklist

def remove_user_from_blacklist(initiator, target):
	blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))
	if not blacklist:
		return Response(status=status.HTTP_410_GONE)
	blacklist.delete()
	deleted_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))

	if not deleted_blacklist:
		return Response(status=status.HTTP_200_OK)
	return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
