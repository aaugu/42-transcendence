from django.db import models
from django.utils import timezone, dateformat

# Create your models here.
class User(models.Model):
    user_id = models.PositiveIntegerField(blank=False)

    def __str__(self):
        return str(self.user_id)
    
class Blacklist(models.Model):
    initiator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='initiator')
    blacklisted = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blacklisted')

    def __str__(self):
        return str(self.id)

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

    def get_date(self):
        return dateformat.format(timezone.localtime(self.timestamp), 'Y-m-d')
    
    def get_time(self):
        return dateformat.format(timezone.localtime(self.timestamp), 'H:i')

    def __str__(self):
        return str(self.author) + ": " + str(self.message)


# timestamp = models.DateTimeField(auto_now_add=True)