from django.contrib import admin

# Register your models here.
from .models import *

admin.site.register(Conversation)
admin.site.register(Message)
