from django.urls import path
from .views import *

urlpatterns = [
    path('', general_user.as_view(), name='general_user'),
    path('<int:pk>/', detailed_user.as_view(), name='detailed_user'),
    path('<int:pk>/friends/', friends_list_user.as_view(), name='friend_list'),
    path('<int:pk>/friends/delete/<int:friend_id>/', friends_list_user.as_view(), name='delete_friend'),
]
