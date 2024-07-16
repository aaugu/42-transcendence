FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y

COPY config/requirements.txt app/

RUN pip install --no-cache-dir -r app/requirements.txt

WORKDIR /app

COPY . .

# EXPOSE 9000

CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]

