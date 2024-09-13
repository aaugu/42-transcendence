# Generated by Django 4.1.13 on 2024-09-04 22:23

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Games',
            fields=[
                ('game_id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('creator_id', models.IntegerField()),
                ('joiner_id', models.IntegerField()),
                ('winner_id', models.IntegerField(blank=True, null=True)),
                ('looser_id', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('WAITING', 'Waiting for player'), ('IN_PROGRESS', 'In progress'), ('FINISHED', 'Finished')], default='WAITING', max_length=20)),
            ],
        ),
    ]
