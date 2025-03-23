#!/bin/bash

echo "Running send script every 20 seconds..."
python manage.py makemigrations
python manage.py migrate

/run_every_20_seconds.sh &
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000