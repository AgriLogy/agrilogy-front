#!/bin/bash

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Optional: flush DB if you want
# python manage.py flush --no-input

# Add crontab jobs (this writes them into the crontab file)
python manage.py crontab add

# Start cron daemon (run in background)
cron

# Optional: See cron jobs installed
crontab -l

# Start Django server (or whatever you need)
python manage.py runserver 0.0.0.0:8000
