FROM postgres:16.3-bookworm

RUN apt update -y && apt upgrade -y

# RUN chmod +x ./config/config.sh
# RUN sh ./config/config.sh $AETHERYTE_POSTGRES_USER

COPY ./config/init.sql /docker-entrypoint-initdb.d/init.sql

EXPOSE 5432