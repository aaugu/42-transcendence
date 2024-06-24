FROM python:3.12.4-bookworm

# Configure image parameters
RUN apt update -y
RUN apt upgrade -y
RUN apt install postgresql postgresql-contrib -y

COPY ./config/requirements.txt /config/requirements.txt

# RUN pip install -r /config/requirements.txt -y

CMD ["sh", "-c", "while true; do sleep 1; done"]