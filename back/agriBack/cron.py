# agriBack/cron.py

import os
import json
import django
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
from django_cron import CronJobBase, Schedule

# Initialize Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from CustomUser.models import CustomUser
from analytics.models import Sensor

import logging

logger = logging.getLogger(__name__)

class SendDataCronJob(CronJobBase):
    RUN_EVERY_MINS = 1  # Run the job every 60 minutes (1 hour)

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'agriBack.send_data_cron'  # Unique code for the cron job

    def do(self):
        json_file_path = '/shared/requests.json'

        if not os.path.exists(json_file_path):
            logger.error(f"File not found: {json_file_path}")
            return
        else:
            logger.info(f"Found file: {json_file_path}")

        try:
            with open(json_file_path, 'r') as f:
                data_list = json.load(f)
        except FileNotFoundError:
            logger.error(f"Failed to open file: {json_file_path}")
            return

        for data in data_list:
            username = data.get('user')

            try:
                user = CustomUser.objects.get(username=username)
                logger.info(f"Found user: {user.username}")
            except ObjectDoesNotExist:
                logger.error(f"User '{username}' does not exist.")
                continue  # Skip this item

            timestamp_str = data.get('timestamp')
            timestamp_obj = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S.%f')

            sensor = Sensor.objects.create(
                user=user,
                precipitation_rate=data.get('precipitation_rate'),
                humidity_weather=data.get('humidity_weather'),
                wind_speed=data.get('wind_speed'),
                solar_radiation=data.get('solar_radiation'),
                pressure_weather=data.get('pressure_weather'),
                wind_direction=data.get('wind_direction'),
                temperature_weather=data.get('temperature_weather'),
                ec_soil_medium=data.get('ec_soil_medium'),
                soil_temperature_medium=data.get('soil_temperature_medium'),
                soil_ec_high=data.get('soil_ec_high'),
                ec_soil_low=data.get('ec_soil_low'),
                soil_moisture_medium=data.get('soil_moisture_medium'),
                soil_moisture_high=data.get('soil_moisture_high'),
                soil_moisture_low=data.get('soil_moisture_low'),
                ph_soil=data.get('ph_soil'),
                soil_temperature_low=data.get('soil_temperature_low'),
                soil_temperature_high=data.get('soil_temperature_high'),
                timestamp=timestamp_obj
            )

            logger.info(f"Created Sensor for user '{username}' with ID: {sensor.id}")
