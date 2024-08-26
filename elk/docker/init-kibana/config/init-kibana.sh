until curl -s -X GET "http://172.20.6.3:5601/api/status" | grep "status"; do
  echo "Attente du démarrage de Kibana..."
  sleep 5
done

# Créer une Data View
curl -X POST "http://172.20.6.3:5601/api/saved_objects/index-pattern/my-data-view" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  -u "${ELASTICSEARCH_USERNAME}:${ELASTIC_PASSWORD}" \
  -d '{
    "attributes": {
      "title": "my-data-view-*",
      "timeFieldName": "@timestamp"
    }
  }'