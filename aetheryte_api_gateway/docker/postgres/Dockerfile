FROM postgres:16.3-bookworm

RUN apt update -y && apt upgrade -y

COPY ./config/init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432