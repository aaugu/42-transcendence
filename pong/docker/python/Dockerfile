FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y

COPY config/requirements.txt config/

RUN pip install --no-cache-dir -r config/requirements.txt

WORKDIR /app

COPY . .

EXPOSE 9000

CMD python3 manage.py migrate && python3 manage.py runserver 0.0.0.0:9000
