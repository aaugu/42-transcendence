from django.urls import path
from .views import general_user, detailed_user

urlpatterns = [
    path('', general_user, name='create_user'),
    path('<int:pk>/', detailed_user, name='user_detail'),
]