from rest_framework import status, generics, permissions
from rest_framework.response import Response
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


from .models import UserVerification, CustomUser
from .utils import generate_verification_code, check_autentication, get_user_from_jwt
from .serializers import *


    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            user = CustomUser.objects.get(username=request.data['username'])
            if user.is_2fa_enabled:
                verification_code = generate_verification_code()
                UserVerification.objects.update_or_create(user=user, defaults={'verification_code': verification_code})

                send_mail(
                    'Your verification code',
                    f'Your verification code is {verification_code}',
                    'from@example.com',
                    [user.email],
                    fail_silently=False,
                )

                request.session['verification_user_id'] = user.id
                return Response({"detail": "Verification code sent to email"}, status=status.HTTP_200_OK)
            else:
                tokens = response.data
                access_token = tokens.get('access')
                refresh_token = tokens.get('refresh')

                response.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                )
                response.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                )
        return response

class Verify2FACodeView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = VerifyCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        verification_code = serializer.validated_data['verification_code']
        user_id = request.session.get('verification_user_id')
        if user_id:
            user_verification = get_object_or_404(UserVerification, user_id=user_id)
            if user_verification.verification_code == verification_code:
                user = user_verification.user
                refresh = RefreshToken.for_user(user)
                response_data = {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
                response = Response(response_data, status=status.HTTP_200_OK)
                request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + str(refresh.access_token)
                print(request.META['HTTP_AUTHORIZATION'])
                response.set_cookie(
                    key='access_token',
                    value=str(refresh.access_token),
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                )
                response.set_cookie(
                    key='refresh_token',
                    value=str(refresh),
                    httponly=True,
                    secure=False,
                    samesite='Lax',
                )
                return response
            else:
                return Response({"detail": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Verification code not found"}, status=status.HTTP_400_BAD_REQUEST)

class UpdateUser(APIView):
    def get_object(self, user_id):
        return get_object_or_404(CustomUser, id=user_id)

    def patch(self, request):
        user_id = get_user_from_jwt(request)
        user = self.get_object(user_id)
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

