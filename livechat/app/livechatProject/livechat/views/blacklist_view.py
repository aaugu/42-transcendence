from django.db.models import Q
from django.http import HttpResponse

from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

import requests

from livechat.models import User, Blacklist
from livechat.serializers import UserSerializer, BlacklistSerializer

class BlacklistView(APIView):
	# POST:
	def post(self, request, pk):
		serializer = BlacklistSerializer(data=request.data)
		if serializer.is_valid():
			initiator = serializer.validated_data['initiator']
			target = serializer.validated_data['target']
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)
		
		if not initiator or not target:
			return Response(status=status.HTTP_404_NOT_FOUND)

		status_code = self.create_blacklist(initiator, target)
		if status_code == status.HTTP_201_CREATED:
			return Response({ "blacklisted_id": target.user_id}, status=status_code)

		return Response( status=status_code )

	# DELETE :
	def delete(self, request, pk, target):
		initiator = User.objects.filter(user_id=pk)
		target = User.objects.filter(user_id=target)
		if not initiator or not target:
			return Response(status=status.HTTP_404_NOT_FOUND)

		status_code = self.delete_blacklist(initiator, target)
		if status_code == status.HTTP_204_NO_CONTENT:
			return Response({ "blacklisted_id": target}, status=status_code)
		
		return Response( status=status_code )

	def create_blacklist(self, initiator, target):
		if self.blacklist_exists(initiator, target):
			return status.HTTP_409_CONFLICT

		blacklist = Blacklist(initiator=initiator, target=target)
		blacklist.save()

		new_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))
		if new_blacklist:
			return status.HTTP_201_CREATED
		return status.HTTP_422_UNPROCESSABLE_ENTITY

	def blacklist_exists(self, initiator, target):
		blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))

		if blacklist:
			return True
		return False

	def delete_blacklist(self, initiator, target):
		if not self.blacklist_exists(initiator, target):
			return Response(status=status.HTTP_410_GONE)
			
		blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))[0]
		blacklist.delete()
		deleted_blacklist = Blacklist.objects.filter(Q(initiator=initiator) & Q(target=target))

		if not deleted_blacklist:
			return Response(status=status.HTTP_200_OK)
		return Response(status=status.HTTP_422_UNPROCESSABLE_ENTITY)