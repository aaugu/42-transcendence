from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
# from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

import requests, json

from livechat.models import Conversation, Message, Blacklist
from livechat.serializers import ConversationSerializer, MessageSerializer

# Messages : get all messages from a conversation
class MessageView(APIView):
	def get(self, request, pk):
		if self.conversation_exists(pk):    
			messages = Message.objects.filter(Q(conversation_id=pk))
			serializer = MessageSerializer(messages, many=True)
			return Response({ "messages": serializer.data }, status=status.HTTP_200_OK)
		else:
			return Response(status=status.HTTP_404_NOT_FOUND)

	def conversation_exists(self, id):
		conversation = Conversation.objects.filter(id=id)
		if conversation:
			return True
		return False

# @api_view(['GET'])
# def messageViewSet(request, pk):
# 	if conversation_exists(pk):    
# 		messages = Message.objects.filter(Q(conversation_id=pk))
# 		serializer = MessageSerializer(messages, many=True)
# 		return Response({ "messages": serializer.data }, status=status.HTTP_200_OK)
# 	else:
# 		return Response(status=status.HTTP_404_NOT_FOUND)