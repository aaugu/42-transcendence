FROM python:3.12.4-bookworm

# DEBUG installation
RUN apt update -y
RUN apt upgrade -y
RUN apt install postgresql postgresql-contrib -y

CMD ["sh", "-c", "while true; do sleep 1; done"]