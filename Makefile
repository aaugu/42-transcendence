NAME				= transcendence
DOCKER_COMPOSE_PATH	= docker-compose.yml
DOCKER_COMPOSE		= docker-compose -f $(DOCKER_COMPOSE_PATH) -p $(NAME)

# Colors
GREEN			= \033[0;32m
END				= \033[0m

all : prepare down build up-detached

prepare :
	@(sh ./common/prepare_transcendence.sh)
	@(echo "${GREEN}Transcendence successfully prepared !${END}")

build:
	@(echo "Creating images...")
	@($(DOCKER_COMPOSE) build)

up:
	@(echo "Building, creating and starting containers...")
	@($(DOCKER_COMPOSE) up)

up-detached:
	@(echo "Building, creating and starting containers...")
	@($(DOCKER_COMPOSE) up -d)

down:
	@(echo "Stopping containers...")
	@($(DOCKER_COMPOSE) down)

start:
	@($(DOCKER_COMPOSE) start)

stop:
	@(echo "Stopping containers...")
	@($(DOCKER_COMPOSE) stop)

clean: down
	@(sh ./common/destroy_transcendence.sh)

fclean: clean
	@(docker system prune -a)
	#@(rm $(ENV_PATH))

re: fclean all

.PHONY: all prepare build up up-detached down start stop clean fclean re
