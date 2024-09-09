FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y

COPY config/requirements.txt app/

RUN pip install --no-cache-dir -r app/requirements.txt

COPY config/config.sh config/
RUN chmod +x config/config.sh

RUN apt install dos2unix
RUN dos2unix config/config.sh

EXPOSE 8000

ENTRYPOINT [ "sh", "config/config.sh" ]