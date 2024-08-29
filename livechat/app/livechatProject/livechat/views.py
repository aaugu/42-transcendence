from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

import requests, json

from livechat.models import User, Conversation, Message, Blacklist
from livechat.serializers import UserSerializer, ConversationSerializer, MessageSerializer

# Users
@api_view(['GET', 'POST'])
def userViewSet(request):
	# GET users
	if request.method == 'GET':
		users = User.objects.all()
		serializer = UserSerializer(users, many=True)
		return Response({"users": serializer.data }, status=status.HTTP_200_OK)

# Conversations  
@api_view(['GET', 'POST'])
def conversationViewSet(request, pk):
	# GET: conversations involving current user
	if request.method == 'GET':
		if not user_exists(pk):
			if not create_user(pk):
				return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

		conversations = Conversation.objects.filter(Q(user_1=pk) | Q(user_2=pk))
		serializer = ConversationSerializer(conversations, many=True)

		return Response({ "conversations": serializer.data }, status=status.HTTP_200_OK)

	# POST: create conversation with two users
	elif request.method == 'POST':
		body_unicode = request.body.decode('utf-8')
		body = json.loads(body_unicode)
		print(body)
		serializer = ConversationSerializer(data=request.data)
		if serializer.is_valid():
			user_id = serializer.validated_data['user_1']
			target_id = serializer.validated_data['user_2']
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		status_code = create_conversation(user_id, target_id)
		return Response(status=status_code)

# Messages : get all messages from a conversation
@api_view(['GET'])
def messageViewSet(request, pk):
	if conversation_exists(pk):    
		messages = Message.objects.filter(Q(conversation_id=pk))
		serializer = MessageSerializer(messages, many=True)
		return Response({ "messages": serializer.data }, status=status.HTTP_200_OK)
	else:
		return Response(status=status.HTTP_404_NOT_FOUND)

# Blacklist
@api_view(['POST', 'DELETE'])
def blacklistViewSet(request):
	serializer = ConversationSerializer(data=request.data)
	if serializer.is_valid():
		initiator_id = serializer.validated_data['initiator']
		blacklisted = serializer.validated_data['target']
	else:
		return Response(status=status.HTTP_400_BAD_REQUEST)

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

# ------------------------------ Utils ------------------------------

# Users
def user_exists(user_id):
	user = User.objects.filter(Q(user_id=user_id))

	if user:
		return True
	return False

def create_user(user_id):
	user = User(user_id=user_id)
	user.save()

	user_created = User.objects.filter(Q(user_id=user_id))
	return user_created

# Conversation
def create_conversation(user_id, target_id):
	if conversation_exists(user_id, target_id):
		return 409
	else:
		if not user_exists(target_id):
			if not create_user(target_id):
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
	
def conversation_exists(user_id, target_id):
	conversation_1 = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))
	conversation_2 = Conversation.objects.filter(Q(user_1=target_id) & Q(user_2=user_id))
	if conversation_1 or conversation_2:
		return True
	return False

def conversation_exists(id):
	conversation = Conversation.objects.filter(id=id)
	if conversation:
		return True
	return False
	
# Blacklist
def blacklist_user(initiator, target):

	blacklist = Blacklist(initiator=initiator, target=target)
	blacklist.save()

	new_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))
	return new_blacklist

def blacklist_exists(initiator, target):
	return

def remove_user_from_blacklist(initiator, target):
	blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))
	if not blacklist:
		return Response(status=status.HTTP_410_GONE)
	blacklist.delete()
	deleted_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))

	if not deleted_blacklist:
		return Response(status=status.HTTP_200_OK)
	return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)