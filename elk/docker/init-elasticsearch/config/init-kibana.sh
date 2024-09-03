CYAN='\033[0;36m'
ROUGE='\033[0;31m'
VERT='\033[0;32m'
NC='\033[0m'

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "\n$CYAN-------------------- GENERATING KIBANA MODEL VIEW... --------------------$NC"

until curl -s -X GET "http://172.20.6.3:5601/api/status" | grep -q '"level":"available"'; do
  echo "Waiting for  Kibana..."
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
echo "\n$VERT-------------------- KIBANA MODEL VIEW SUCCESSFULLY UPDATED --------------------$NC"
