FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y
RUN apt install -y dos2unix

COPY config/requirements.txt config/
COPY config/start_aetheryte.sh config/

RUN dos2unix config/start_aetheryte.sh
RUN chmod +x config/start_aetheryte.sh

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r config/requirements.txt

EXPOSE 8000

CMD ["sh", "config/start_aetheryte.sh"]
# CMD ["sh", "-c", "while true; do sleep 1; done"]