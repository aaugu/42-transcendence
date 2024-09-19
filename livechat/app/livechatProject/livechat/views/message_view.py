from rest_framework import permissions, viewsets
from rest_framework.response import Response
# from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from livechat.models import *
from livechat.serializers import ConversationSerializer, MessageSerializer

# Messages : get all messages from a conversation
class MessageView(APIView):
	def get(self, request, user_id, conversation_id):
		if not self.conversation_exists(conversation_id):
			return Response(status=status.HTTP_404_NOT_FOUND)

		conversation = Conversation.objects.get(id=conversation_id)
		conv_serializer = ConversationSerializer(conversation)

		if user_id != conversation.user_1 and user_id != conversation.user_2:
			return Response(status=status.HTTP_404_NOT_FOUND)

		initiator = User.objects.get(user_id=user_id)
		if (conversation.user_1 == user_id):
			target = User.objects.get(user_id=conversation.user_2)
		else:
			target = User.objects.get(user_id=conversation.user_1)
		contact_blacklisted = self.is_blacklist(initiator, target)
		is_blacklisted = self.is_blacklist(target, initiator)

		messages = Message.objects.filter(conversation_id=conversation_id)
		msg_serializer = MessageSerializer(messages, many=True)

		return Response({
							"messages": msg_serializer.data,
							"conversation": conv_serializer.data,
							"contact_blacklisted": contact_blacklisted,
							"is_blacklisted": is_blacklisted
						},
						status=status.HTTP_200_OK)

	def conversation_exists(self, id):
		conversation = Conversation.objects.filter(id=id)
		if conversation:
			return True
		return False
	
	def is_blacklist(self, initiator, target):
		blacklist = Blacklist.objects.filter(initiator=initiator, target=target)
		if blacklist:
			return True
		return False