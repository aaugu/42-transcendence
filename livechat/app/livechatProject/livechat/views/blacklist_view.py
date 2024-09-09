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
	def post(self, request, pk):
		serializer = BlacklistSerializer(data=request.data)
		if serializer.is_valid():
			target_id = serializer.validated_data['target'].user_id
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)

		initiator = User.objects.filter(user_id=pk)[0]
		target = User.objects.filter(user_id=target_id)[0]
		if not initiator or not target:
			return Response(status=status.HTTP_404_NOT_FOUND)

		status_code = self.create_blacklist(initiator, target)
		if status_code == status.HTTP_201_CREATED:
			return Response({ "blacklisted_id": target.user_id}, status=status_code)

		return Response( status=status_code )

	# DELETE :
	def delete(self, request, pk, target_id):
		initiator = User.objects.filter(user_id=pk)[0]
		target = User.objects.filter(user_id=target_id)[0]
		if not initiator or not target:
			return Response(status=status.HTTP_404_NOT_FOUND)

		status_code = self.delete_blacklist(initiator, target)
		if status_code == status.HTTP_204_NO_CONTENT:
			return Response({ "blacklisted_id": target.user_id }, status=status_code)
		
		return Response( status=status_code )

	# UTILS
	def create_blacklist(self, initiator, target):
		if self.blacklist_exists(initiator, target):
			return status.HTTP_409_CONFLICT

		blacklist = Blacklist(initiator=initiator, target=target)
		blacklist.save()

		if self.blacklist_exists(initiator, target):
			return status.HTTP_201_CREATED
		return status.HTTP_422_UNPROCESSABLE_ENTITY

	def delete_blacklist(self, initiator, target):
		if not self.blacklist_exists(initiator, target):
			return status.HTTP_410_GONE
			
		blacklist = Blacklist.objects.filter(initiator=initiator, target=target)
		blacklist.delete()

		if not self.blacklist_exists(initiator, target):
			return status.HTTP_204_NO_CONTENT
		return status.HTTP_422_UNPROCESSABLE_ENTITY

	def blacklist_exists(self, initiator, target):
		blacklist = Blacklist.objects.filter(initiator=initiator, target=target)

		if blacklist:
			return True
		return False