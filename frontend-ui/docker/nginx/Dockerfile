FROM nginx:1.27.0-bookworm

# ------------------------- SECURE SOCKET LAYER -------------------------
# Install OpenSSL
RUN mkdir -p /etc/nginx/ssl
RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y openssl

# Generate SSL certificate (req for request / -x509 for self-signed / -nodes for non encrypted private key)
RUN openssl req -x509 -nodes \
			-out /etc/nginx/ssl/certificate.crt \
			-keyout /etc/nginx/ssl/private.key \
			-subj "/C=SW/ST=VD/L=Lausanne/O=42-transcendence/CN=localhost"

# Configure NGINX by overwritting configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# # Prepare NGINX start
# COPY start_nginx.sh /usr/local/start_nginx.sh
# RUN chmod +x /usr/local/start_nginx.sh

COPY index.html /var/www/html/
RUN chmod -R 755 /var/www/html/

# Exposes port 443 and makes it available only for inter-container communication (required for SSL protocol)
EXPOSE 443

# # Set executable that will always run when the container is initiated
# ENTRYPOINT [ "sh", "usr/local/start_nginx.sh" ]