#!/bin/bash

# Vérifiez que les variables d'environnement nécessaires sont définies
if [ -z "$ELASTIC_PASSWORD" ] || [ -z "$ELASTICSEARCH_USERNAME" ] || [ -z "$USER_PASSWORD" ]; then
  echo "Les variables ELASTIC_PASSWORD, ELASTICSEARCH_USERNAME, et USER_PASSWORD doivent être définies dans le fichier .env."
  exit 1
fi

# Attendre que Elasticsearch soit disponible avec authentification
until curl -s -u elastic:"$ELASTIC_PASSWORD" http://172.20.6.2:9200/_cluster/health?pretty > /dev/null; do
  echo "Waiting for Elasticsearch..."
  sleep 5
done

# Créer un utilisateur standard
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://172.20.6.2:9200/_security/user/$ELASTICSEARCH_USERNAME" -H "Content-Type: application/json" -u elastic:"$ELASTIC_PASSWORD" -d "{\"password\" : \"$USER_PASSWORD\", \"roles\" : [\"kibana_user\"]}")

if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
  echo "User $ELASTICSEARCH_USERNAME created with kibana_user role."
else
  echo "Failed to create user $ELASTICSEARCH_USERNAME. HTTP status code: $response"
fi