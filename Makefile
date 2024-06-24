NAME                = transcendence
DOCKER_COMPOSE_PATH = docker-compose.yml
DOCKER_COMPOSE      = docker-compose -f $(DOCKER_COMPOSE_PATH) -p $(NAME)

AETHERYTE_DB_VOLUME_PATH		= aetheryte_api_gateway/docker/volumes/db
USER_MANAGEMENT_DB_VOLUME_PATH  = user_management/docker/volumes/db
TOURNAMENT_DB_VOLUME_PATH       = tournament/docker/volumes/db

DB_VOLUME_PATHS = $(USER_MANAGEMENT_DB_VOLUME_PATH) \
                  $(TOURNAMENT_DB_VOLUME_PATH) \
                  $(NOTIFICATION_DB_VOLUME_PATH) \
				  $(AETHERYTE_DB_VOLUME_PATH)

# Colors
BLUE            = \033[44m
END             = \033[0m

all: prepare down build up-detached

prepare:
	@(mkdir -p $(DB_VOLUME_PATHS))
	@if [ ! -e $(ENV_PATH) ]; then \
		echo "$(BLUE).env file is missing!$(END)"; \
		exit 1; \
	fi

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
	@(docker system prune -a -f)
	sh ./tools/createScrap.sh

fclean: clean down
	@(docker volume rm $$(docker volume ls -q))


re: fclean all

.PHONY: all prepare build up up-detached down start stop clean fclean re
