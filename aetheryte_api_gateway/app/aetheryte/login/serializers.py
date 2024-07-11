from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CustomUser

class Enable2FASerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['is_2fa_enabled']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")

class VerifyCodeSerializer(serializers.Serializer):
    verification_code = serializers.CharField()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        return token

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_2fa_enabled']
