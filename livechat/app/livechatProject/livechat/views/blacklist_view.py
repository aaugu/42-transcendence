from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests

from livechat.models import User, Blacklist
from livechat.serializers import BlacklistSerializer

class BlacklistView(APIView):
	# POST:
	def post(self, request, user_id):
		serializer = BlacklistSerializer(data=request.data)
		if serializer.is_valid():
			blacklisted_id = serializer.validated_data['blacklisted_id']
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		initiator = User.objects.get(user_id=user_id)
		target = User.objects.get(user_id=blacklisted_id)
		if not initiator or not target:
			return Response(status=status.HTTP_404_NOT_FOUND)

		status_code = self.create_blacklist(initiator, target)
		return Response( status=status_code )

	# DELETE :
	def delete(self, request, user_id, target_id):
		initiator = User.objects.get(user_id=user_id)
		target = User.objects.get(user_id=target_id)
		if not initiator or not target:
			return Response(status=status.HTTP_404_NOT_FOUND)

		status_code = self.delete_blacklist(initiator, target)	
		return Response( status=status_code )

	# UTILS
	def create_blacklist(self, initiator, target):
		if self.blacklist_exists(initiator, target):
			return status.HTTP_409_CONFLICT

		blacklist = Blacklist(initiator=initiator, target=target, blacklisted_id=target.user_id)
		blacklist.save()

		if self.blacklist_exists(initiator, target):
			return status.HTTP_201_CREATED
		return status.HTTP_500_INTERNAL_SERVER_ERROR

	def delete_blacklist(self, initiator, target):
		if not self.blacklist_exists(initiator, target):
			return status.HTTP_410_GONE
			
		blacklist = Blacklist.objects.get(initiator=initiator, target=target)
		blacklist.delete()

		if not self.blacklist_exists(initiator, target):
			return status.HTTP_204_NO_CONTENT
		return status.HTTP_500_INTERNAL_SERVER_ERROR

	def blacklist_exists(self, initiator, target):
		blacklist = Blacklist.objects.filter(initiator=initiator, target=target)

		if blacklist:
			return True
		return False