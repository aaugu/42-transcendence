#!/bin/bash

# Vérifiez que les variables d'environnement nécessaires sont définies
if [ -z "$ELASTIC_PASSWORD" ] || [ -z "$ELASTICSEARCH_USERNAME" ]; then
  echo "Les variables ELASTIC_PASSWORD et ELASTICSEARCH_USERNAME doivent être définies dans le fichier .env."
  exit 1
fi

# Attendre que Elasticsearch soit disponible avec authentification
until curl -s -u elastic:"$ELASTIC_PASSWORD" http://172.20.6.2:9200/_cluster/health?pretty > /dev/null; do
  echo "Waiting for Elasticsearch..."
  sleep 5
done

create_or_update_role_response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "http://$ELASTICSEARCH_HOST:$ELASTICSEARCH_PORT/_security/role/custom_kibana_admin" -H "Content-Type: application/json" -u elastic:"$ELASTIC_PASSWORD" -d '{
  "cluster": ["monitor", "manage"],
  "indices": [
    {
      "names": [".kibana*", ".security*", ".monitoring*", ".management*"],
      "privileges": ["read", "write", "view_index_metadata", "manage"],
    },
    "allow_restricted_indices": "true"
  ],
  "applications": [
    {
      "application": "kibana-.kibana",
      "privileges": ["read", "write"],
      "resources": ["*"]
    }
  ]
}')


if [ "$create_role_response" -ne 200 ] && [ "$create_role_response" -ne 201 ]; then
  echo "Failed to create role custom_kibana_admin. HTTP status code: $create_role_response"
  exit 1
else
  echo "Role custom_kibana_admin created successfully."
fi

# Créer un utilisateur avec le rôle custom_kibana_admin
create_user_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://172.20.6.2:9200/_security/user/$ELASTICSEARCH_USERNAME" -H "Content-Type: application/json" -u elastic:"$ELASTIC_PASSWORD" -d "{\"password\" : \"$ELASTIC_PASSWORD\", \"roles\" : [\"custom_kibana_admin\"]}")

if [ "$create_user_response" -eq 200 ] || [ "$create_user_response" -eq 201 ]; then
  echo "User $ELASTICSEARCH_USERNAME created with custom_kibana_admin role."
else
  echo "Failed to create user $ELASTICSEARCH_USERNAME. HTTP status code: $create_user_response"
  exit 1
fi
