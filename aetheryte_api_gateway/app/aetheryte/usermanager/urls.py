from django.urls import path
from .views import *

urlpatterns = [
    path('', generalUser, name='general user'),
	path('<int:pk>/', detailedUser, name='detailed user'),
]