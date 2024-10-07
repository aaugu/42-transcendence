from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from login.models import *
from login.serializers import *
from login.utils import *

from .utils import *
from .serializer import *

class general_user(APIView):
    def post(self, request):
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            new_user = CustomUser(
                username=serializer.validated_data['username'],
                nickname=serializer.validated_data['nickname'],
                email=serializer.validated_data['email'],
                avatar=serializer.validated_data['avatar'],
                is_2fa_enabled=False
            )
            new_user.set_password(request.data['password'])
            new_user.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_409_CONFLICT)
        
class detailed_user(APIView):
    def get(self, request, pk):
        if check_authentication(request):
            if check_user_jwt_vs_user_url(request, pk):
                try:
                    user = CustomUser.objects.get(pk=pk)
                except CustomUser.DoesNotExist:
                    return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
                serializer = CustomUserSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ERROR: ", "Unauthorized access"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        

    def patch(self, request, pk):
        if check_authentication(request):
            if check_user_jwt_vs_user_url(request, pk):
                try:
                    user = CustomUser.objects.get(pk=pk)
                except CustomUser.DoesNotExist:
                    return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
                serializer = CustomPatchSerializer(user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                else:
                    return Response({"error":"invalide charactere in value"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            else:
                return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ERROR: ", "Unauthorized access"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)

class friends_list_user(APIView):
    def get(self, request, pk):
        if check_authentication(request):
            if check_user_jwt_vs_user_url(request, pk):
                try:
                    user = CustomUser.objects.get(pk=pk)
                except CustomUser.DoesNotExist:
                    return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
                return Response({"friends": user.friends_list}, status=status.HTTP_200_OK)
            else:
                return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        
        
        
    def post(self, request, pk):
        if check_authentication(request):
            if check_user_jwt_vs_user_url(request, pk):
                try:
                    user = CustomUser.objects.get(pk=pk)
                except CustomUser.DoesNotExist:
                    return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
                
                fid = request.data.get("friend_nickname")
                
                if fid:
                    try:
                        new_friend = CustomUser.objects.get(nickname=fid)
                    except (ValueError, CustomUser.DoesNotExist):
                        return Response({"status": "ERROR", "details": "No user with this ID to add in friends list"}, status=status.HTTP_404_NOT_FOUND)
                    
                    if new_friend.id in user.friends_list:
                        return Response({"status": "ERROR", "details": "already in the friend list"}, status=status.HTTP_400_BAD_REQUEST)
                    
                    if new_friend.nickname == user.nickname:
                        return Response({"status": "ERROR", "details": "cannot add himself as a friend"}, status=status.HTTP_400_BAD_REQUEST)
                    
                    user.friends_list.append(new_friend.id)
                    user.save()
                    return Response({"status": "done"}, status=status.HTTP_200_OK)
                else:
                    return Response({"status": "ERROR", "details": "No friend_id provided in the body, need to give a friend_nickname in body"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        
class friends_list_user_delete(APIView):
    def delete(self, request, pk, friend_id):
        if check_authentication(request):
            if check_user_jwt_vs_user_url(request, pk):
                try:
                    user = CustomUser.objects.get(pk=pk)
                except CustomUser.DoesNotExist:
                    return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
                
                try:
                    fid_int = int(friend_id)
                except ValueError:
                    return Response({"status": "ERROR", "details": "Invalid friend ID"}, status=status.HTTP_400_BAD_REQUEST)
                
                if fid_int not in user.friends_list:
                    return Response({"status": "ERROR", "details": "Friend ID not in the friend list"}, status=status.HTTP_400_BAD_REQUEST)
                
                user.friends_list.remove(fid_int)
                user.save()
                return Response({"status": "Friend removed successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        
class get_friends_status(APIView):
    def get(self, request, pk):
        if check_authentication(request):
            if check_user_jwt_vs_user_url(request, pk):
                try:
                    user = CustomUser.objects.get(pk=pk)
                except CustomUser.DoesNotExist:
                    return Response({"status": "ERROR", "details": "No user with this ID"}, status=status.HTTP_404_NOT_FOUND)
                
                ufl = user.friends_list
                
                online_statuses = CustomUser.objects.filter(id__in=ufl).values('id', 'nickname', 'online')

                return Response({"status": "OK", "online_statuses": online_statuses}, status=status.HTTP_200_OK)
            else:
                return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"status": "ERROR", "details": "Authentication failed"}, status=status.HTTP_403_FORBIDDEN)


class ChangePasswordView(APIView):

    def post(self, request, user_id, *args, **kwargs):
        if check_authentication(request):
            if check_user_jwt_vs_user_url(request, user_id):
                data = request.data.copy()
                data['user_id'] = user_id
                serializer = ChangePasswordSerializer(data=data, context={'request': request})
                if serializer.is_valid():
                    serializer.save()
                    return Response({"detail": "Password successfully updated"}, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"ERROR": "Unauthorized access"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response({"status": "ERROR", "details": "Authentication failed"}, status=status.HTTP_403_FORBIDDEN)
        
class getUserByNickname(APIView):
    def get(self, request, user_nickname):
        if check_authentication(request):
            try:
                user = CustomUser.objects.get(nickname=user_nickname)
            except CustomUser.DoesNotExist:
                return Response({"status": "ERROR", "details": "No user with this Nickname"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CustomUserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({"ERROR: ", "Unauthorized access"}, status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
        