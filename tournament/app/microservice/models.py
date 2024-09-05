from django.db import models
from django.contrib.postgres.fields import ArrayField

from tournament import settings

# Create your models here.

class Tournament(models.Model):
    CREATED = 0
    IN_PROGRESS = 1
    FINISHED = 2

    name = models.CharField(max_length=settings.MAX_TOURNAMENT_NAME_LENGTH)
    admin_id = models.IntegerField(default=0)
    max_players = models.IntegerField(default=16, blank=True)
    is_private = models.BooleanField(default=False)
    password = models.CharField(max_length=settings.HASH_PASSWORD_MAX_LENGTH, blank=True, null=True)
    status = models.IntegerField(default=CREATED)
    start_datetime = models.DateTimeField(null=True)


class Player(models.Model):
    nickname = models.CharField(max_length=settings.MAX_NICKNAME_LENGTH)
    user_id = models.IntegerField()
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='players')


class Match(models.Model):
    NOT_PLAYED = 0
    IN_PROGRESS = 1
    FINISHED = 2

    player_1 = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name='player_1')
    player_2 = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name='player_2')
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, null=True, related_name='winner')
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='matches')
    match_id = models.IntegerField()
    status = models.IntegerField(default=NOT_PLAYED)
    # player_1_score = models.IntegerField(null=True)
    # player_2_score = models.IntegerField(null=True)