openssl req -x509 -nodes \
			-out /certificate/certificate.crt \
			-keyout /certificate/private.key \
			-subj "/C=SW/ST=VD/L=Lausanne/O=42/CN=transcendence"