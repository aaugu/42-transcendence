CYAN='\033[0;36m'
ROUGE='\033[0;31m'
VERT='\033[0;32m'
NC='\033[0m'

# Vérifiez que les variables d'environnement nécessaires sont définies
if [ -z "$ELASTIC_PASSWORD" ] || [ -z "$ELASTICSEARCH_USERNAME" ]; then
  echo "$ROUGE---> Les variables ELASTIC_PASSWORD et ELASTICSEARCH_USERNAME doivent être définies dans le fichier .env.$NC"
  exit 1
fi

echo "$CYAN-------------------- GENERATING ELASTIC USER GROUP... --------------------$NC"

# Attendre que Elasticsearch soit disponible avec authentification
until curl -s -u elastic:"$ELASTIC_PASSWORD" http://172.20.6.2:9200/_cluster/health?pretty > /dev/null; do
  echo "Waiting for Elasticsearch..."
  sleep 5
done

create_or_update_role_response=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "http://172.20.6.2:9200/_security/role/custom_kibana_admin" -H "Content-Type: application/json" -u elastic:"$ELASTIC_PASSWORD" -d '{
  "cluster": ["all"],
  "indices": [
    {
      "names": [".kibana*", ".security*", ".monitoring*", ".management*", "logs-*"],
      "privileges": ["all"],
      "allow_restricted_indices": true
    }
  ],
  "applications": [
    {
      "application": "kibana-.kibana",
      "privileges": ["all"],
      "resources": ["*"]
    }
  ]
}')


# Vérifier le code de retour de la création du rôle
if [ "$create_or_update_role_response" -ne 200 ] && [ "$create_or_update_role_response" -ne 201 ]; then
  echo "$ROUGEFailed to create role custom_kibana_admin. HTTP status code: $create_or_update_role_response $NC"
  exit 1
else
  echo "$VERT Role custom_kibana_admin created successfully.$NC"
fi

echo "$CYAN-------------------- GENERATING ELASTIC USER... --------------------$NC"

# Créer un utilisateur avec le rôle custom_kibana_admin
create_user_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "http://172.20.6.2:9200/_security/user/$ELASTICSEARCH_USERNAME" -H "Content-Type: application/json" -u elastic:"$ELASTIC_PASSWORD" -d "{\"password\" : \"$ELASTIC_PASSWORD\", \"roles\" : [\"custom_kibana_admin\"]}")

if [ "$create_user_response" -eq 200 ] || [ "$create_user_response" -eq 201 ]; then
  echo "$VERT User $ELASTICSEARCH_USERNAME created with custom_kibana_admin role.$NC"
else
  echo "$ROUGE Failed to create user $ELASTICSEARCH_USERNAME. HTTP status code: $create_user_response $NC"
  exit 1
fi
