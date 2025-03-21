import os
import django
import json
from datetime import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from django.core.exceptions import ObjectDoesNotExist
from CustomUser.models import CustomUser
from analytics.models import Sensor

json_file_path = '/shared/requests.json'

with open(json_file_path, 'r') as f:
    data_list = json.load(f)

for data in data_list:
    username = data.get('user')
    
    try:
        user = CustomUser.objects.get(username=username)
        print(f"✅ Found user: {user.username}")
    except ObjectDoesNotExist:
        print(f"❌ User with username '{username}' does not exist.")
        continue  # Skip to next item or not ?
    
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

    print(f"✅ Created Sensor for user '{username}' with ID: {sensor.id}")