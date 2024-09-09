FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y

COPY config/requirements.txt /config/requirements.txt

RUN pip install --no-cache-dir -r config/requirements.txt

EXPOSE 10000

CMD ["sh", "config/start_django.sh"]

