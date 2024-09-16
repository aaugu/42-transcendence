from django.db import models
from django.utils import timezone, dateformat

# Create your models here.
class User(models.Model):
    user_id = models.PositiveIntegerField(blank=False)

    def __str__(self):
        return str(self.user_id)

class Conversation(models.Model):
    user_1 = models.PositiveIntegerField(blank=False)
    user_2 = models.PositiveIntegerField(blank=False)

    def __str__(self):
        return str(self.id)

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE)
    author = models.PositiveIntegerField(blank=False)
    message = models.TextField(blank=False)
    date = models.CharField(blank=False)
    time = models.CharField(blank=False)

    def __str__(self):
        return str(self.conversation.id) + " - " + str(self.author) + ": " + str(self.message)


class Blacklist(models.Model):
    initiator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='initiator')
    target = models.ForeignKey(User, on_delete=models.CASCADE, related_name='target')
    blacklisted_id = models.PositiveIntegerField(blank=False)

    def __str__(self):
        return str(self.initiator) + " -> " + str(self.target)