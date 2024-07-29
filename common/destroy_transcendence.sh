#!/bin/bash

# Move Image Data Volumes to trash directory
file_name=scrap
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
new_fileName=$file_name.$current_time

LIVECHAT_VOLUME_PATH="livechat/docker/volumes/data"
TOURNAMENT_VOLUME_PATH="tournament/docker/volumes/data"
AETHERYTE_VOLUME_PATH="aetheryte_api_gateway/docker/volumes/data"

if [ -d $LIVECHAT_VOLUME_PATH ]; then
    mv -f livechat/docker/volumes trash/aetheryte/$new_fileName
fi

if [ -d $TOURNAMENT_VOLUME_PATH ]; then
    mv -f tournament/docker/volumes trash/tournament/$new_fileName
fi

if [ -d $AETHERYTE_VOLUME_PATH ]; then
    mv -f aetheryte_api_gateway/docker/volumes trash/aetheryte/$new_fileName
fi

# Remove Postgres config files
LIVECHAT_CONFIG_FILE="livechat/docker/postgres/init.sql"
TOURNAMENT_CONFIG_FILE="tournament/docker/postgres/init.sql"
AETHERYTE_CONFIG_FILE="aetheryte_api_gateway/docker/postgres/init.sql"

if [ -f $LIVECHAT_CONFIG_FILE ]; then
    rm $LIVECHAT_CONFIG_FILE
fi

if [ -f $TOURNAMENT_CONFIG_FILE ]; then
    rm $TOURNAMENT_CONFIG_FILE
fi

if [ -f $AETHERYTE_CONFIG_FILE ]; then
    rm $AETHERYTE_CONFIG_FILE
fi

# Remove Env files
TOURNAMENT_ENV_FILE="tournament/app/.env"
AETHERYTE_ENV_FILE="aetheryte_api_gateway/app/.env"
LIVECHAT_ENV_FILE="livechat/app/.env"

if [ -f $TOURNAMENT_ENV_FILE ]; then
    rm $TOURNAMENT_ENV_FILE
fi

if [ -f $AETHERYTE_ENV_FILE ]; then
    rm $AETHERYTE_ENV_FILE
fi

if [ -f $LIVECHAT_ENV_FILE ]; then
    rm $LIVECHAT_ENV_FILE
fi

