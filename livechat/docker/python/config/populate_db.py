# #!/bin/sh

# Ouvrir console docker python avec la commande "docker exec -it transcendence-livechat-python-1 bash"

# Effectuer les commandes suivantes dans la console docker:

# cd app/livechatProject

# Si la base de données est vide, passer ces 3 commandes
# python manage.py flush (mettre "yes")
# python manage.py makemigrations
# python manage.py migrate

# python manage.py shell

# Copier coller le code suivant dans la console python :
nb_user = 5
nb_conversations = nb_user - 1
last_user = nb_user - 1

from livechat.models import *
import random
from random import randrange
import requests

for i in range(nb_user):
    user = User(user_id=i)
    user.save()

for i in range(nb_conversations):
    conversation = Conversation(user_1=last_user, user_2=i)
    conversation.save()

word_site = "https://www.mit.edu/~ecprice/wordlist.10000"
response = requests.get(word_site)
WORDS = response.content.splitlines()
conversations = list(Conversation.objects.all())

for i in range(59):
    conversation = random.choice(conversations)
    if randrange(2) == 0:
        author = conversation.user_1
    else:
        author = conversation.user_2
    text_message = random.choice(WORDS).decode('utf-8')
    date = "2024-08-22"
    if i < 10:
        time = "13:0" + str(i)
    else:
        time = "13:" + str(i)
    message = Message(conversation=conversation, author=author, message=text_message, date=date, time=time)
    message.save()

