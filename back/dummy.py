import os
import random
import django
from datetime import datetime, timedelta
from faker import Faker

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from django.core.exceptions import ObjectDoesNotExist
from CustomUser.models import CustomUser
from analytics.models import Sensor, Notification, Alert, NotificationsPerUser
from analytics.models import Zone
from django.utils.timezone import make_aware

# Initialize Faker
fake = Faker()

# Get specific user
try:
    user = CustomUser.objects.get(username='user3')
except ObjectDoesNotExist:
    print("❌ User with username 'user3' does not exist.")
    exit()

print(f"✅ Found user: {user.username}")

# Get or create a zone for the user
zone, _ = Zone.objects.get_or_create(
    user=user,
    name="zone de marichage 3",
    defaults={
        "space": 1750.0,
        "kc": 15.0,
        "soil_type": "clay",
        "critical_moisture_threshold": 18.0,
        "flow_rate": 1.0,
    }
)

# Generate only 3 notifications
for i in range(3):
    formatted_timestamp = make_aware(datetime.now() - timedelta(days=random.randint(0, 10)))

    # --- Sensor logic commented out ---
    # sensor = Sensor.objects.create(
    #     user=user,
    #     zone=zone,
    #     precipitation_rate=random.uniform(0, 100),
    #     humidity_weather=random.randint(20, 100),
    #     wind_speed=random.uniform(0, 50),
    #     solar_radiation=random.uniform(100, 1000),
    #     pressure_weather=random.uniform(900, 1100),
    #     wind_direction=random.randint(0, 360),
    #     temperature_weather=random.randint(-10, 45),
    #     ec_soil_medium=random.uniform(0, 5),
    #     soil_temperature_medium=random.randint(5, 30),
    #     soil_ec_high=random.uniform(0, 5),
    #     ec_soil_low=random.uniform(0, 5),
    #     soil_moisture_medium=random.randint(10, 50),
    #     soil_moisture_high=random.randint(10, 50),
    #     soil_moisture_low=random.randint(10, 50),
    #     ph_soil=random.uniform(5.0, 8.5),
    #     soil_temperature_low=random.randint(5, 30),
    #     soil_temperature_high=random.randint(5, 30),
    #     timestamp=formatted_timestamp
    # )

    today_temp = random.uniform(10, 35)
    today_humidity = random.uniform(30, 90)
    soil_temp = random.uniform(10, 30)
    soil_ph = random.uniform(5.5, 7.5)

    notification = Notification.objects.create(
        yesterday_temperature=today_temp - random.uniform(1, 5),
        today_temperature=today_temp,
        yesterday_humidity=today_humidity - random.uniform(5, 10),
        today_humidity=today_humidity,
        ET0=random.uniform(0, 10),
        soil_humidity=random.uniform(10, 50),
        soil_temperature=soil_temp,
        soil_ph=soil_ph,
        perfect_irrigation_period="Morning (6 AM - 9 AM)" if today_temp > 20 else "Evening (6 PM - 9 PM)",
        last_irrigation_date=datetime.now() - timedelta(days=random.randint(1, 7)),
        last_start_irrigation_hour=fake.time_object(),
        last_finish_irrigation_hour=fake.time_object(),
        used_water_irrigation=random.uniform(100, 5000),
        # water_flow_sensor=5,
        notification_date=formatted_timestamp
    )

    NotificationsPerUser.objects.create(
        user=user,
        notification=notification,
        is_read=False
    )

    print(f"🔔 Notification {i+1} created.")

print("✅ Successfully generated 3 notifications for user3.")
