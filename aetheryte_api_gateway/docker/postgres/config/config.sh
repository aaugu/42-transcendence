SQL="ALTER USER $1 WITH superuser createrole createdb replication bypassrls;"
echo $SQL > init.sql;