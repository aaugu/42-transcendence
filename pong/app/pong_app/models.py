import uuid
from django.db import models

class Games(models.Model):
    game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator_id = models.IntegerField()
    joiner_id = models.IntegerField()
    winner_id = models.IntegerField(null=True, blank=True)
    looser_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    STATUS_CHOICES = [
        ('WAITING', 'Waiting for player'),
        ('IN_PROGRESS', 'In progress'),
        ('FINISHED', 'Finished'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')