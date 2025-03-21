FROM python:3.9-slim

WORKDIR /app

COPY server.py /app/server.py

COPY requests.json /shared/requests.json
COPY send.py /shared/send.py

VOLUME /shared

EXPOSE 9090

CMD ["python", "server.py"]

