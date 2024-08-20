#!/bin/bash

# Attendre que Elasticsearch soit disponible
until curl -s http://localhost:9200/_cluster/health?pretty; do
  echo "Waiting for Elasticsearch..."
  sleep 5
done

# Créer un utilisateur standard
curl -X POST "http://172.20.6.2:9200/_security/user/${ELASTICSEARCH_USERNAME}" -H "Content-Type: application/json" -u elastic:${ELASTIC_PASSWORD} -d '{
  "password" : "'${USER_PASSWORD}'",
  "roles" : ["kibana_user"]
}'

echo "User ${ELASTICSEARCH_USERNAME} created with kibana_user role."