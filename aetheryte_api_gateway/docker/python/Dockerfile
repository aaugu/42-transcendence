FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y

COPY config/requirements.txt config/
COPY config/start_aetheryte.sh config/

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r config/requirements.txt

EXPOSE 8000

CMD ["sh", "-c", "/config/start_aetheryte.sh"]
