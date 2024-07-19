NAME				= transcendence
DOCKER_COMPOSE_PATH	= docker-compose.yml
DOCKER_COMPOSE		= docker-compose -f $(DOCKER_COMPOSE_PATH) -p $(NAME)
ENV_PATH			= .env

# Colors
GREEN			= \033[0;32m
CYAN			= \033[0;36m
RED				= \033[0;31m
END				= \033[0m

all : prepare down build up-detached

prepare :
	@(sh ./common/prepare_transcendence.sh)
	@(sh ./common/generate_postgres_config.sh)
	@(echo "${GREEN}Transcendence successfully prepared !${END}")

build :
	@(echo "${CYAN}Creating images...${END}")
	@($(DOCKER_COMPOSE) build)

up :
	@(echo "${CYAN}Building, creating and starting containers...${END}")
	@($(DOCKER_COMPOSE) up)

up-detached :
	@(echo "${CYAN}Building, creating and starting containers...${END}")
	@($(DOCKER_COMPOSE) up -d)

down :
	@(if [ ! -e ./.env ]; then echo "${RED}Env file is missing${END}"; exit 1; fi)
	@(echo "${CYAN}Stopping and remove containers...")
	@($(DOCKER_COMPOSE) down)

start :
	@(echo "${CYAN}Starting containers...${END}")
	$(DOCKER_COMPOSE) start

stop :
	@(echo "${CYAN}Stopping existing containers...${END}")
	
	# $(DOCKER_COMPOSE) -f $(DC_FILE) $(NAME) stop

clean: down
	@(echo "${CYAN}Removing existing images...${END}")
	@(if [ "$$(docker images -q)" ]; then docker rmi -f $$(docker images -qa); fi)

fclean: clean
	@(echo "${CYAN}Clearing persistent existing volumes and remove .env file...${END}")
	@(sh ./common/destroy_transcendence.sh)
	@(if [ "$$(docker volume ls -q)" ]; then docker volume rm $$(docker volume ls -q); fi)
	@(rm $(ENV_PATH))

re: fclean all

.PHONY: all prepare build up up-detached down start stop clean fclean re

