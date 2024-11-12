from livechat.models import User, Conversation, Message, Blacklist
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_id']

class ConversationSerializer(serializers.ModelSerializer):
    user_1 = serializers.SerializerMethodField()
    user_2 = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'user_1', 'user_2']

    def get_user_1(self, obj):
        return obj.user_1.user_id

    def get_user_2(self, obj):
        return obj.user_2.user_id

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['author', 'message', 'date', 'time']

class BlacklistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blacklist
        fields = ['blacklisted_id']