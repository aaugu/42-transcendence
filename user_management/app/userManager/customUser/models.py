from django.db import models

class CustomUser(models.Model):
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=255, unique=True)
    nickname = models.CharField(max_length=30)

    def __str__(self):
        return self.username