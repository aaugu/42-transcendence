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
COPY config/nginx.conf /etc/nginx/transcendence.conf

# Exposes port 443 and makes it available only for inter-container communication (required for SSL protocol)
EXPOSE 443