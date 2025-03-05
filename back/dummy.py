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
from analytics.models import Sensor, Notification, Alert, NotificationsPerUser

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

# Generate Sensor, Notification, and Alert records
current_date = BEGIN_DATE
while current_date <= END_DATE:
    formatted_timestamp = current_date.strftime("%Y-%m-%d %H:%M:%S.%f")  
    formatted_timestamp = datetime.strptime(formatted_timestamp, "%Y-%m-%d %H:%M:%S.%f")  

    # Generate sensor data
    sensor = Sensor.objects.create(
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
        timestamp=formatted_timestamp
    )

    # Generate Notification
    notification = Notification.objects.create(
        yesterday_temperature=random.uniform(-10, 45),
        today_temperature=sensor.temperature_weather,
        yesterday_humidity=random.uniform(20, 100),
        today_humidity=sensor.humidity_weather,
        ET0=random.uniform(0, 10),
        soil_humidity=random.uniform(10, 50),
        soil_temperature=sensor.soil_temperature_medium,
        soil_ph=sensor.ph_soil,
        perfect_irrigation_period="Morning (6 AM - 9 AM)" if sensor.temperature_weather > 20 else "Evening (6 PM - 9 PM)",
        last_irrigation_date=(current_date - timedelta(days=random.randint(1, 7))),
        last_start_irrigation_hour=fake.time(),
        last_finish_irrigation_hour=fake.time(),
        used_water_irrigation=random.uniform(100, 5000),
        notification_date=formatted_timestamp
    )

    NotificationsPerUser.objects.create(
        user=user,
        notification=notification,
        is_read=False
    )

    # Generate Alert based on conditions
    alert = None
    danger_level = "Low"

    if sensor.temperature_weather > 40:
        danger_level = "High"
        title = "Extreme Heat Alert"
        description = f"Temperature reached {sensor.temperature_weather}°C. High risk of crop damage!"
    
    elif sensor.soil_moisture_low < 15:
        danger_level = "Medium"
        title = "Low Soil Moisture Alert"
        description = f"Soil moisture dropped to {sensor.soil_moisture_low}%. Consider irrigating soon."
    
    elif sensor.wind_speed > 30:
        danger_level = "Medium"
        title = "Strong Wind Alert"
        description = f"Wind speed is {sensor.wind_speed} m/s. Risk of soil erosion and crop damage."

    if danger_level != "Low":
        alert = Alert.objects.create(
            title=title,
            description=description,
            danger_level=danger_level
        )


    current_date += timedelta(days=1)

print(f"🎉 Successfully created sensor records, notifications, and alerts for {user.username}!")
