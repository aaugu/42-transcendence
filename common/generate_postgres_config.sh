chmod 744 .env

# Aetheryte API Gateway
AETHERYTE_POSTGRES_USER=$(cat .env | grep AETHERYTE_POSTGRES_USER= | cut -d '=' -f2)
AETHERYTE_SQL="ALTER USER ${AETHERYTE_POSTGRES_USER} WITH superuser createrole createdb replication bypassrls;"
echo $AETHERYTE_SQL > aetheryte_api_gateway/docker/postgres/config/init.sql

# Micro service TOURNAMENT

# Micro service USER MANAGEMENT