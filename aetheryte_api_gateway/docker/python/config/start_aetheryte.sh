#!/bin/sh

cd /app/aetheryte

sudo service nginx start

python3 -m manage makemigrations
python3 -m manage migrate

# python3 -m manage createsuperuser --noinput

python3 -m manage runserver 0.0.0.0:8000