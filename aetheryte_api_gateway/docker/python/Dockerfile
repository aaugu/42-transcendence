FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y
RUN apt install -y dos2unix openssl nginx sudo vim

COPY config/requirements.txt config/
COPY config/start_aetheryte.sh config/

RUN dos2unix config/start_aetheryte.sh
RUN chmod +x config/start_aetheryte.sh

RUN openssl req -x509 -nodes \
			-out /etc/ssl/certificate.crt \
			-keyout /etc/ssl/private.key \
			-subj "/C=SW/ST=VD/L=Lausanne/O=42-transcendence/CN=172.20.0.2"

COPY config/nginx.conf /etc/nginx/nginx.conf
COPY config/aetheryte.conf /etc/nginx/sites-available/aetheryte.conf

RUN ln -s /etc/nginx/sites-available/aetheryte.conf /etc/nginx/sites-enabled/
RUN chmod 744 /etc/nginx/sites-available/aetheryte.conf

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r config/requirements.txt

EXPOSE 8000

CMD ["sh", "config/start_aetheryte.sh"]