#!/bin/bash

# Move Image Data Volumes to trash directory
file_name=scrap
current_time=$(date "+%Y.%m.%d-%H.%M.%S")
new_fileName=$file_name.$current_time

USER_MANAGEMENT_VOLUME_PATH="user_management/docker/volumes/data"
TOURNAMENT_VOLUME_PATH="tournament/docker/volumes/data"
AETHERYTE_VOLUME_PATH="aetheryte_api_gateway/docker/volumes/data"

if [ -d ${USER_MANAGEMENT_VOLUME_PATH} ]; then
    mv -f user_management/docker/volumes trash/user/$new_fileName
fi

if [ -d ${TOURNAMENT_VOLUME_PATH} ]; then
    mv -f tournament/docker/volumes trash/tournament/$new_fileName
fi

if [ -d ${AETHERYTE_VOLUME_PATH} ]; then
    mv -f aetheryte_api_gateway/docker/volumes trash/aetheryte/$new_fileName
fi

# Remove Postgres config files
USER_MANAGEMENT_CONFIG_FILE="user_management/docker/postgres/init.sql"
TOURNAMENT_CONFIG_FILE="tournament/docker/postgres/init.sql"
AETHERYTE_CONFIG_FILE="aetheryte_api_gateway/docker/postgres/init.sql"

if [ -f ${USER_MANAGEMENT_CONFIG_FILE} ]; then
    rm ${USER_MANAGEMENT_CONFIG_FILE}
fi

if [ -f ${TOURNAMENT_CONFIG_FILE} ]; then
    rm ${TOURNAMENT_CONFIG_FILE}
fi

if [ -f ${AETHERYTE_CONFIG_FILE} ]; then
    rm ${AETHERYTE_CONFIG_FILE}
fi
