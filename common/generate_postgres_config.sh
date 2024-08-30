#!/bin/bash

CYAN='\033[0;36m'
NC='\033[0m'

echo "$CYAN-------------------- GENERATING POSTGRES CONFIG... --------------------$NC"

# Aetheryte API Gateway
AETHERYTE_POSTGRES_USER=$(cat .env | grep AETHERYTE_POSTGRES_USER= | cut -d '=' -f2)
AETHERYTE_SQL="ALTER USER ${AETHERYTE_POSTGRES_USER} WITH superuser createrole createdb replication bypassrls;"
echo $AETHERYTE_SQL > aetheryte_api_gateway/docker/postgres/config/init.sql

# Micro service TOURNAMENT
TOURNAMENT_POSTGRES_USER=$(cat .env | grep TOURNAMENT_POSTGRES_USER= | cut -d '=' -f2)
TOURNAMENT_SQL="ALTER USER ${TOURNAMENT_POSTGRES_USER} WITH superuser createrole createdb replication bypassrls;"
echo $TOURNAMENT_SQL > tournament/docker/postgres/config/init.sql

# Micro service LIVE CHAT
LIVECHAT_POSTGRES_USER=$(cat .env | grep LIVECHAT_POSTGRES_USER= | cut -d '=' -f2)
LIVECHAT_SQL="ALTER USER ${LIVECHAT_POSTGRES_USER} WITH superuser createrole createdb replication bypassrls;"
echo $LIVECHAT_SQL > livechat/docker/postgres/config/init.sql
