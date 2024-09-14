#!/bin/sh

cd /app/

python3 -m manage makemigrations
python3 -m manage migrate

python3 -m manage runserver 0.0.0.0:10000