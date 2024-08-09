from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.db.models import Q
import random # A supprimer a la fin
from .models import User
from .models import Conversation
from .models import Message

def index(request):
    users = list(User.objects.all())
    
    if not users:
        conversations = Conversation.objects.none()
        random_user = User.objects.none()
        username = 'Username'
        user_id = 0

    else:
        random_user = random.choice(users)
        user_id = random_user.id
        username = random_user.username
        conversations = Conversation.objects.filter(Q(user_1=user_id) | Q(user_2=user_id))
        
    context = { 
        "user": user_id,
        "username": username,
        "contact_list": conversations
    }

    return render(request, "index.html", context)
        
