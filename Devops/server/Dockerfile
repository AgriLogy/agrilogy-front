FROM python:3.9-slim

WORKDIR /app

COPY server.py /app/server.py

EXPOSE 9090

# COPY requirements.txt /app/requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

CMD ["python", "server.py"]
