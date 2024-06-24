FROM postgres:16.3-bookworm

# Configure image parameters
RUN apt update -y \
    && apt upgrade -y \
    && apt install vim -y

COPY ./config/init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432