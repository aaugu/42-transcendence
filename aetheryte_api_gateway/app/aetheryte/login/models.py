# models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    #User informations
    nickname = models.CharField(max_length=30, blank=True)

    # 2fa Informations
    is_2fa_enabled = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)

class UserVerification(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    verification_code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.verification_code}"