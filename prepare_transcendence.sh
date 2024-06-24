CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

USER_MANAGEMENT_DB_VOLUME_PATH="user_management/docker/volumes/db"
TOURNAMENT_DB_VOLUME_PATH="tournament/docker/volumes/db"
AETHERYTE_DB_VOLUME_PATH="aetheryte_api_gateway/docker/volumes/db"
ENV_PATH=".env"

echo "-------------------- PREPARING DOCKER TO START... --------------------"

echo "${CYAN}Checking .env file...${NC}"
if [ ! -f ${ENV_PATH} ]; then
	echo "${RED}.env file is missing!${NC}"
	exit 1
else
	echo "${GREEN}.env file successfully found${NC}"
fi

# echo "${CYAN}Creating directories to store data...${NC}"
# if [ ! -d ${USER_MANAGEMENT_DB_VOLUME_PATH} ]
# then
# 	mkdir -p ${USER_MANAGEMENT_DB_VOLUME_PATH}
# 	if [ ! -d ${USER_MANAGEMENT_DB_VOLUME_PATH} ]
# 	then
# 		echo "${RED}ERROR: Could not create User management data directory!${NC}"
# 		exit 1
# 	else
# 		echo "${GREEN}User management data directory created!${NC}"
# 	fi
# else
# 	echo "${YELLOW}User management data directory was already created!${NC}"
# fi

# if [ ! -d ${TOURNAMENT_DB_VOLUME_PATH} ]
# then
# 	mkdir -p ${TOURNAMENT_DB_VOLUME_PATH}
# 	if [ ! -d ${TOURNAMENT_DB_VOLUME_PATH} ]
# 	then
# 		echo "${RED}ERROR: Could not create Tournament data directory!${NC}"
# 		exit 1
# 	else
# 		echo "${GREEN}Tournament data directory created!${NC}"
# 	fi
# else
# 	echo "${YELLOW}Tournament data directory was already created!${NC}"
# fi

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