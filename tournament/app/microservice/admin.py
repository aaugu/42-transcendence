from django.contrib import admin

# Register your models here.

from .models import Tournament

admin.site.register(Tournament)