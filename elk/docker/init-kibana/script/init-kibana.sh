CYAN='\033[0;36m'
NC='\033[0m'

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "$CYAN-------------------- GENERATING KIBANA MODEL VIEW... --------------------$NC"

until curl -s -X GET "http://172.20.6.3:5601/api/status" | grep -q '"level":"available"'; do
  echo "Attente du démarrage de Kibana..."
  sleep 5
done

# Créer une Data View
sleep 20

curl -X POST "http://172.20.6.3:5601/api/saved_objects/index-pattern/my-data-view" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  -u "${ELASTICSEARCH_USERNAME}:${ELASTIC_PASSWORD}" \
  -d '{
    "attributes": {
      "title": "logs-transcendence-*",
      "timeFieldName": "@timestamp"
    }
  }'
echo "\n$CYAN-------------------- KIBANA MODEL VIEW SUCCESSFULLY UPDATED --------------------$NC"
