#!/bin/bash

# Infinite loop to run the job every 20 seconds
while true; do
    # Run the cron job
    /usr/local/bin/python /code/run_every_20_seconds.py >> /var/log/cron.log 2>&1
    # Sleep for 20 seconds before running again
    sleep 20
done
