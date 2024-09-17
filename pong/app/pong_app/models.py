import uuid
from django.db import models

class Games(models.Model):
    game_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator_id = models.IntegerField()
    joiner_id = models.IntegerField(null=True, blank=True)
    winner_id = models.IntegerField(null=True, blank=True)
    loser_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    mode = models.CharField(max_length=50, null=True, blank=True)
    
    STATUS_CHOICES = [
        ('WAITING', 'Waiting for player'),
        ('IN_PROGRESS', 'In progress'),
        ('FINISHED', 'Finished'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='WAITING')

    def to_dict(self):
      return {
        'game_id': str(self.game_id),
        'creator_id': self.creator_id,
        'joiner_id': self.joiner_id,
        'winner_id': self.winner_id,
        'loser_id': self.loser_id,
        'created_at': str(self.created_at),
        'mode': self.mode,
        'status': self.status,
      }