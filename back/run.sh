#!/bin/bash

# Optional: Tail cron log for debugging (optional in dev, remove in prod)
# touch /var/log/cron.log
# tail -f /var/log/cron.log &  # Uncomment this line for debugging

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Optional: flush DB if you want
# python manage.py flush --no-input

# Add crontab jobs (this writes them into the crontab file)
# Uncomment if you want to dynamically add cron jobs from Django
# python manage.py crontab add

# Start cron in the background
# echo "Starting cron..."
# cron

# Optional: Check if cron is running (for debugging purposes)
# ps aux | grep cron

# Start Django server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
