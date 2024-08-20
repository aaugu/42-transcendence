from livechat.models import User
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from livechat.serializers import UserSerializer

@api_view(['GET', 'POST'])
def userViewSet(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response({"status": serializer.data, "args": "coucou"}, status=status.HTTP_200_OK)

# class UserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     return Response({"value": serializer_class.data}, status=status.HTTP_200_OK)

# from django.shortcuts import render

# # Create your views here.
# from django.http import HttpResponse
# from django.db.models import Q
# import random # A supprimer a la fin
# from .models import User
# from .models import Conversation
# from .models import Message

# def homepage(request):
#     current_user = User.objects.filter(Q(user_1=request.current_user))
#     if not current_user:
#         current_user = create_user(request.current_user)

#     user = current_user.user_id

#     conversations = Conversation.objects.filter(Q(user_1=user) | Q(user_2=user))

#     return

# def create_conversation(request):
#     current_user = User.objects.filter(Q(user_1=request.current_user))
#     if not current_user:
#         create_user(request.current_user)

#     target = User.objects.filter(Q(user_1=request.target))
#     if not target:
#         create_user(request.target)
    
#     conversation = Conversation(current_user.user_id, target.user_id)
#     conversation.save()

#     return

# def create_user(user_id):
#     return



# def blacklist_user(request):
#     return

