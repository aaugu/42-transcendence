#!/bin/bash

cd /app/aetheryte
python3 -m manage migrate
python3 -m manage runserver 0.0.0.0:8000