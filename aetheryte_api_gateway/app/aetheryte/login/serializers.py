from django.contrib.auth import get_user_model, authenticate
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re
from django.core.exceptions import ValidationError

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
        fields = ['id', 'username', 'nickname', 'email', 'is_2fa_enabled', 'avatar', 'online']

    def validate_username(self, value):
        # Vérification si le nickname contient seulement des caractères alphanumériques
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError("Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.")
        return value
    
    def validate_nickname(self, value):
        # Vérification si le nickname contient seulement des caractères alphanumériques
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError("Enter a valid nickname. This value may contain only letters, numbers, and @/./+/-/_ characters.")
        return value
    
    def validate_email(self, value):
        # Vérification si le nickname contient seulement des caractères alphanumériques
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError("Enter a valid email. This value may contain only letters, numbers, and @/./+/-/_ characters.")
        return value
