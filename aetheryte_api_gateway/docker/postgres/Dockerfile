FROM postgres:16.3-bookworm

RUN apt update -y
RUN apt upgrade -y
RUN apt install vim -y

COPY config/init.sql /config/init.sql

# CMD psql -U postgres postgres -f config/init.sql

EXPOSE 5432