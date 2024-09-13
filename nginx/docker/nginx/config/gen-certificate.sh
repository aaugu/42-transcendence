openssl req -x509 -nodes \
			-out /etc/nginx/ssl/certificate.crt \
			-keyout /etc/nginx/ssl/private.key \
			-subj "/C=SW/ST=VD/L=Lausanne/O=42/CN=transcendence"