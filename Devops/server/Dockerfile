FROM python:3.9-slim

WORKDIR /app

COPY server.py /app/server.py

# Create the shared directory and set permissions before copying
RUN mkdir -p /shared && chmod 777 /shared
RUN touch /shared/requests.json

RUN chmod 777 /shared/requests.json

EXPOSE 9090

CMD ["python", "server.py"]
