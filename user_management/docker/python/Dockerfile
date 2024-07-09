FROM python:3.12.4-bookworm

RUN apt update -y && apt upgrade -y
RUN apt install -y dos2unix

COPY config/requirements.txt app/
COPY config/start_user_manager.sh config/

RUN dos2unix config/start_user_manager.sh
RUN chmod +x config/start_user_manager.sh

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r app/requirements.txt

EXPOSE 9000

# CMD ["sh", "-c", "while true; do sleep 1; done"]
CMD ["sh", "config/start_user_manager.sh"]