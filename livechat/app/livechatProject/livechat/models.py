from django.db import models
from django.utils import timezone, dateformat

# Create your models here.
class User(models.Model):
    username = models.CharField()

    def __str__(self):
        return self.username

class Conversation(models.Model):
    user_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_1")
    user_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_2")

    def __str__(self):
        return self.id

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    sender = models.PositiveIntegerField(blank=False)
    message = models.TextField(blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sender

    def date(self):
        return dateformat.format(timezone.localtime(self.timestamp), 'Y-m-d')
    
    def time(self):
        return dateformat.format(timezone.localtime(self.timestamp), 'H:i:s')