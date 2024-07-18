NAME				= transcendence
DOCKER_COMPOSE_PATH	= docker-compose.yml
DOCKER_COMPOSE		= docker-compose -f $(DOCKER_COMPOSE_PATH) -p $(NAME)
ENV_PATH			= .env

# Colors
GREEN			= \033[0;32m
END				= \033[0m

all : prepare down build up-detached

prepare :
	@(sh ./common/prepare_transcendence.sh)
	@(echo "${GREEN}Transcendence successfully prepared !${END}")

build :
	@(echo "Creating images...")
	@($(DOCKER_COMPOSE) build)

up :
	@(echo "Building, creating and starting containers...")
	@($(DOCKER_COMPOSE) up)

up-detached :
	@(echo "Building, creating and starting containers...")
	@($(DOCKER_COMPOSE) up -d)

down :
	@(echo "Stopping and remove containers...")
	@($(DOCKER_COMPOSE) down)

start :
	@(echo "Starting containers...")
	$(DOCKER_COMPOSE) start

stop :
	@(echo "Stopping containers...")
	$(DOCKER_COMPOSE) -f $(DC_FILE) $(NAME) stop

clean: down
	@(echo "Removing images and image volumes...")
	
	@(docker images -q | xargs docker rmi -f)
	@(sh ./common/destroy_transcendence.sh)

fclean: clean
	@(echo "Clearing persistent volumes and remove .env file...")
	@(docker volume rm $$(docker volume ls -q))
	@(rm $(ENV_PATH))

re: fclean all

.PHONY: all prepare build up up-detached down start stop clean fclean re

