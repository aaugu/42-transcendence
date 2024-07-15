CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

TRASH_PATH="trash"
TRASH_AETHERYTE_PATH="${TRASH_PATH}/aetheryte"
TRASH_TOURNAMENT_PATH="${TRASH_PATH}/tournament"

TOURNAMENT_DB_VOLUME_PATH="tournament/docker/volumes/data"
AETHERYTE_DB_VOLUME_PATH="aetheryte_api_gateway/docker/volumes/data"
ENV_PATH=".env"

echo "${CYAN}-------------------- PREPARING DOCKER TO START... --------------------${NC}"

if [ ! -f ${ENV_PATH} ]; then
	echo "${RED}.env file is missing!${NC}"
	exit 1
else
	echo "${GREEN}.env file successfully found${NC}"
fi

if [ ! -d ${TOURNAMENT_DB_VOLUME_PATH} ]
then
	mkdir -p ${TOURNAMENT_DB_VOLUME_PATH}
	if [ ! -d ${TOURNAMENT_DB_VOLUME_PATH} ]
	then
		echo "${RED}ERROR: Could not create Tournament data directory!${NC}"
		exit 1
	else
		echo "${GREEN}Tournament data directory created!${NC}"
	fi
else
	echo "${YELLOW}Tournament data directory was already created!${NC}"
fi

if [ ! -d ${AETHERYTE_DB_VOLUME_PATH} ]
then
	mkdir -p ${AETHERYTE_DB_VOLUME_PATH}
	if [ ! -d ${AETHERYTE_DB_VOLUME_PATH} ]
	then
		echo "${RED}ERROR: Could not create Aetheryte data directory!${NC}"
		exit 1
	else
		echo "${GREEN}Aetheryte data directory created!${NC}"
	fi
else
	echo "${YELLOW}Aetheryte data directory was already created!${NC}"
fi

if [ ! -d ${TRASH_AETHERYTE_PATH} ]
then
	mkdir -p ${TRASH_AETHERYTE_PATH}
fi

if [ ! -d ${TRASH_TOURNAMENT_PATH} ]
then
	mkdir -p ${TRASH_TOURNAMENT_PATH}
fi