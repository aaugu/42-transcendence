#!/bin/sh

cd /app/livechatProject

python manage.py collectstatic

python3 -m manage makemigrations
python3 -m manage migrate

python3 -m manage runserver 0.0.0.0:8000