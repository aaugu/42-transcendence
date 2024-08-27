CYAN='\033[0;36m'
NC='\033[0m'

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

until @curl -s -X GET "http://localhost:5601/api/status" | grep "status"; do
  echo "Attente du démarrage de Kibana..."
  sleep 5
done

# Créer une Data View
echo "$CYAN-------------------- GENERATING KIBANA MODEL VIEW... --------------------$NC"
@curl -X POST "http://localhost:5601/api/saved_objects/index-pattern/my-data-view" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  -u "${ELASTICSEARCH_USERNAME}:${ELASTIC_PASSWORD}" \
  -d '{
    "attributes": {
      "title": "logs-transcendence-*",
      "timeFieldName": "@timestamp"
    }
  }'
echo "$CYAN-------------------- KIBANA MODEL VIEW SUCCESSFULLY UPDATED --------------------$NC"