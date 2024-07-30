from django.db import models
from django.utils import timezone

# Create your models here.
class Conversation(models.Model):
    user1 = models.PositiveIntegerField()
    user2 = models.PositiveIntegerField()

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.PositiveIntegerField()
    senderName = models.CharField()
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def date(self):
        return self.timestamp