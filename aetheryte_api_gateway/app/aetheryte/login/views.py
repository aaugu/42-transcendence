from rest_framework import status
from rest_framework.response import Response
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


from .models import UserVerification, CustomUser
from .utils import *
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

                response.set_cookie(
                    key='csrf_token',
                    value=access_token,
                )
                user.online = True
                user.save()
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
                }
                response = Response(response_data, status=status.HTTP_200_OK)
                request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + str(refresh.access_token)
                response.set_cookie(
                    key='csrf_token',
                    value=str(refresh.access_token),
                )
                user.online = True
                user.save()
                return response
            else:
                return Response({"detail": "Invalid verification code"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "No session id found"}, status=status.HTTP_400_BAD_REQUEST)

class logout_user(APIView):
    
    def post(self, request, user_id):
        try:
            user_id = int(user_id)
        except ValueError:
            return Response({"detail": "Invalid user id"}, status=status.HTTP_400_BAD_REQUEST)

        if user_id > 0:
            user = get_object_or_404(CustomUser, id=user_id)
            user.online = False
            try:
                user.save()
                return Response({"detail": "User successfully logged out"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"detail": f"An error occurred: {str(e)}"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "Invalid user id"}, status=status.HTTP_400_BAD_REQUEST)