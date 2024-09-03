from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status

import requests

from livechat.models import User, Blacklist
from livechat.serializers import UserSerializer, BlacklistSerializer

# Blacklist
@api_view(['POST', 'DELETE'])
def blacklistViewSet(request):
	serializer = BlacklistSerializer(data=request.data)
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