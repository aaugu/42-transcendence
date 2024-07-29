#!/bin/bash

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

TRASH_PATH="trash"
TRASH_AETHERYTE_PATH="${TRASH_PATH}/aetheryte"
TRASH_TOURNAMENT_PATH="${TRASH_PATH}/tournament"
TRASH_LIVECHAT_PATH="${TRASH_PATH}/livechat"

TOURNAMENT_DATA_VOLUME_PATH="tournament/docker/volumes/data"
AETHERYTE_DATA_VOLUME_PATH="aetheryte_api_gateway/docker/volumes/data"
LIVECHAT_DATA_VOLUME_PATH="livechat/docker/volumes/data"
ENV_PATH=".env"

echo "${CYAN}-------------------- PREPARING DOCKER TO START... --------------------${NC}"


if [ ! -d ${TOURNAMENT_DATA_VOLUME_PATH} ]
then
	mkdir -p ${TOURNAMENT_DATA_VOLUME_PATH}
	if [ ! -d ${TOURNAMENT_DATA_VOLUME_PATH} ]
	then
		echo "${RED}ERROR: Could not create Tournament data directory!${NC}"
		exit 1
	else
		echo "${GREEN}Tournament data directory created!${NC}"
	fi
else
	echo "${YELLOW}Tournament data directory was already created!${NC}"
fi

if [ ! -d ${AETHERYTE_DATA_VOLUME_PATH} ]
then
	mkdir -p ${AETHERYTE_DATA_VOLUME_PATH}
	if [ ! -d ${AETHERYTE_DATA_VOLUME_PATH} ]
	then
		echo "${RED}ERROR: Could not create Aetheryte data directory!${NC}"
		exit 1
	else
		echo "${GREEN}Aetheryte data directory created!${NC}"
	fi
else
	echo "${YELLOW}Aetheryte data directory was already created!${NC}"
fi

if [ ! -d ${LIVECHAT_DATA_VOLUME_PATH} ]
then
	mkdir -p ${LIVECHAT_DATA_VOLUME_PATH}
	if [ ! -d ${LIVECHAT_DATA_VOLUME_PATH} ]
	then
		echo "${RED}ERROR: Could not create live chat data directory!${NC}"
		exit 1
	else
		echo "${GREEN}Live chat data directory created!${NC}"
	fi
else
	echo "${YELLOW}Live chat data directory was already created!${NC}"
fi

if [ ! -d ${TRASH_AETHERYTE_PATH} ]
then
	mkdir -p ${TRASH_AETHERYTE_PATH}
fi

if [ ! -d ${TRASH_TOURNAMENT_PATH} ]
then
	mkdir -p ${TRASH_TOURNAMENT_PATH}
fi

if [ ! -d ${TRASH_LIVECHAT_PATH} ]
then
	mkdir -p ${TRASH_LIVECHAT_PATH}
fi