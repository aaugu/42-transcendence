FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y
RUN apt install -y dos2unix

COPY config/requirements.txt /config/requirements.txt
COPY config/start_django.sh /config/start_django.sh

RUN dos2unix config/start_django.sh
RUN chmod +x config/start_django.sh

RUN pip install --no-cache-dir -r config/requirements.txt

EXPOSE 10000

CMD ["sh", "config/start_django.sh"]

