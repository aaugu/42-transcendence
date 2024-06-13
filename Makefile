NAME				= transcendence
DOCKER_COMPOSE_PATH	= docker-compose.yml
DOCKER_COMPOSE		= docker-compose -f $(DC_PATH) -p $(NAME)

USER_MANAGEMENT_DB_VOLUME_PATH	=	user_management/docker/volumes/db
TOURNAMENT_DB_VOLUME_PATH		=	tournament/docker/volumes/db
NOTIFICATION_DB_VOLUME_PATH		=	notification/docker/volumes/db

DB_VOLUME_PATHS	= 	$(USER_MANAGEMENT_DB_VOLUME_PATH) \
					$(TOURNAMENT_DB_VOLUME_PATH) \
					$(NOTIFICATION_DB_VOLUME_PATH)

ENV_PATH		= .env

# Colors
BLUE			= \033[44m
END				= \033[0m

all : prepare #down build up

prepare :
	mkdir -p $(DB_VOLUME_PATHS)
	if [ ! -e .env ]; then
  		exit 1
    fi

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
	@(echo "Stopping containers...")
	@($(DOCKER_COMPOSE) down)

start :
	$(DOCKER_COMPOSE) start

stop :
	$(DOCKER_COMPOSE) -f $(DC_FILE) $(NAME) stop

clean: down
	@(docker system prune -a)

fclean: down
	@(docker system prune -a --volumes)
	@(docker volume rm $$(docker volume ls -q))
	@(sudo rm -rf $(DB_VOLUME_PATHS))
	@(rm $(ENV_PATH))

re: fclean all

.PHONY: all prepare build up up-detached down start stop clean fclean re

