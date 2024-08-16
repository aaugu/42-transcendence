from django.urls import path

from livechat import views

urlpatterns = [
    path("", views.index, name="index"),
]