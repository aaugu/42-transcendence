from django.db import models
from django.utils import timezone, dateformat

# Create your models here.
class Conversation(models.Model):
    user1 = models.PositiveIntegerField()
    user2 = models.PositiveIntegerField()

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.PositiveIntegerField(blank=False)
    message = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def date(self):
        return dateformat.format(timezone.localtime(self.timestamp), 'Y-m-d')
    
    def time(self):
        return dateformat.format(timezone.localtime(self.timestamp), 'H:i:s')