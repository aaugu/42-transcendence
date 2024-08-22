from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from livechat.models import User, Conversation, Message, Blacklist
from livechat.serializers import UserSerializer, ConversationSerializer, MessageSerializer

# Users
@api_view(['GET', 'POST'])
def userViewSet(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"users": serializer.data, }, status=status.HTTP_200_OK)

# Conversations  
@api_view(['GET', 'POST'])
def conversationViewSet(request, pk):
    if request.method == 'GET':
        current_user = User.objects.filter(Q(user_id=pk))
        if not current_user:
            if not create_user(pk):
                return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        conversations = Conversation.objects.filter(Q(user_1=pk) | Q(user_2=pk))
        serializer = ConversationSerializer(conversations, many=True)

        return Response({ "conversations": serializer.data, }, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        target_id = request.body.target_id
        target = User.objects.filter(Q(user_id=target_id))
        if not target:
            if not create_user(target_id):
                return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        
        if not create_conversation(pk, target_id):
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        return Response(status=status.HTTP_201_OK)

# Messages
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

    if request.method == 'POST':
        if not blacklist_user(initiator, target):
            return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return Response( status=status.HTTP_201_OK )
    elif request.method == 'DELETE':
        return unblacklist_user(initiator, target)

# Utils
def create_user(user_id):
    user = User(user_id)
    user.save()

    new_user = User.objects.filter(Q(user_id=user_id))
    return new_user

def create_conversation(user_id, target_id):
    conversation = Conversation(user_id, target_id)
    conversation.save()

    new_conversation = Conversation.objects.filter(Q(user_1=user_id) & Q(user_2=target_id))
    return new_conversation

def blacklist_user(initiator, target):
    blacklist = Blacklist(initiator, target)
    blacklist.save()

    new_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))
    return new_blacklist

def unblacklist_user(initiator, target):
    blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))
    if not blacklist:
        return Response(status=status.HTTP_410_GONE)
    blacklist.delete()
    deleted_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))

    if not deleted_blacklist:
        return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)
