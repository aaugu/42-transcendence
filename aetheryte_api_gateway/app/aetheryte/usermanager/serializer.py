# serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.shortcuts import get_object_or_404
from login.models import CustomUser

class ChangePasswordSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=True)
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate(self, attrs):
        if attrs['old_password'] == attrs['new_password']:
            raise serializers.ValidationError("Le nouveau mot de passe doit être différent de l'ancien.")
        return attrs

    def validate_old_password(self, value):
        user = get_object_or_404(CustomUser, id=self.initial_data['user_id'])
        if not user.check_password(value):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect.")
        return value

    def save(self, **kwargs):
        user = get_object_or_404(CustomUser, id=self.validated_data['user_id'])
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
