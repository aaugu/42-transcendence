FROM nginx:1.27.0-bookworm

# ------------------------- SECURE SOCKET LAYER -------------------------
# Install OpenSSL
RUN mkdir -p /etc/nginx/ssl
RUN apt-get update -y && apt-get upgrade -y

# Configure NGINX by overwritting configuration file
COPY config/nginx.conf /etc/nginx/nginx.conf

# Exposes port 443 and makes it available only for inter-container communication (required for SSL protocol)
EXPOSE 443