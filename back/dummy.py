import os
import random
import django
from datetime import datetime, timedelta
from faker import Faker

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from CustomUser.models import CustomUser
from analytics.models import Sensor

# Initialize Faker
fake = Faker()

# Define date range for data
BEGIN_DATE = datetime(year=2024, month=1, day=1)  # Change as needed
END_DATE = datetime(year=2025, month=2, day=27)    # Change as needed

# Get specific user
try:
    user = CustomUser.objects.get(username='user1')
except ObjectDoesNotExist:
    print("❌ User with username 'user1' does not exist.")
    exit()

print(f"✅ Found user: {user.username}")

# Generate one Sensor record for each day
current_date = BEGIN_DATE
while current_date <= END_DATE:
    # Ensure timestamp format
    formatted_timestamp = current_date.strftime("%Y-%m-%d %H:%M:%S.%f")  # String representation
    formatted_timestamp = datetime.strptime(formatted_timestamp, "%Y-%m-%d %H:%M:%S.%f")  # Convert back to datetime

    Sensor.objects.create(
        user=user,
        precipitation_rate=random.uniform(0, 100),
        humidity_weather=random.randint(20, 100),
        wind_speed=random.uniform(0, 50),
        solar_radiation=random.uniform(100, 1000),
        pressure_weather=random.uniform(900, 1100),
        wind_direction=random.randint(0, 360),
        temperature_weather=random.randint(-10, 45),
        ec_soil_medium=random.uniform(0, 5),
        soil_temperature_medium=random.randint(5, 30),
        soil_ec_high=random.uniform(0, 5),
        ec_soil_low=random.uniform(0, 5),
        soil_moisture_medium=random.randint(10, 50),
        soil_moisture_high=random.randint(10, 50),
        soil_moisture_low=random.randint(10, 50),
        ph_soil=random.uniform(5.0, 8.5),
        soil_temperature_low=random.randint(5, 30),
        soil_temperature_high=random.randint(5, 30),
        timestamp=formatted_timestamp  # Assign correctly formatted timestamp
    )
    current_date += timedelta(days=1)  # Move to the next day

print(f"🎉 Successfully created {((END_DATE - BEGIN_DATE).days) + 1} sensor records for {user.username}!")
