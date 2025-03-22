FROM python:3.9

ENV PYTHONUNBUFFERED 1

WORKDIR /code
RUN mkdir -p /var/log && chmod -R 777 /var/log

# Install dependencies
RUN apt-get update && apt-get install -y \
    cron \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install django-crontab
RUN pip install django-crontab

# Copy the app and crontab files
COPY . /code/

RUN mkdir -p /shared && chmod -R 777 /shared

# Set up cron jobs using django-crontab
RUN python manage.py crontab add

# Give permission to run.sh
RUN chmod +x run.sh

# Start cron and Django
CMD ["bash", "run.sh"]
