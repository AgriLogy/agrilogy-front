FROM python:3.9

ENV PYTHONUNBUFFERED 1

WORKDIR /code

# Install cron + mariadb-client + any other dependencies you need
RUN apt-get update && apt-get install -y \
    mariadb-client \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Copy your app
COPY . /code/

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Give permission to run.sh
RUN chmod +x run.sh

# Start cron and Django
CMD ["bash", "run.sh"]
