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
from analytics.models import Zone  # Assuming Zone model is used
from django.utils.timezone import make_aware

# Initialize Faker
fake = Faker()

# Define date range for data
BEGIN_DATE = datetime(year=2024, month=3, day=18)
END_DATE = datetime(year=2025, month=4, day=10)

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

# Generate Sensor, Notification, and Alert records
current_date = BEGIN_DATE
while current_date <= END_DATE:
    formatted_timestamp = make_aware(datetime.combine(current_date, datetime.min.time()))

    # Generate sensor data
    sensor = Sensor.objects.create(
        user=user,
        zone=zone,
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
    # notification = Notification.objects.create(
    #     yesterday_temperature=random.uniform(-10, 45),
    #     today_temperature=sensor.temperature_weather,
    #     yesterday_humidity=random.uniform(20, 100),
    #     today_humidity=sensor.humidity_weather,
    #     ET0=random.uniform(0, 10),
    #     soil_humidity=random.uniform(10, 50),
    #     soil_temperature=sensor.soil_temperature_medium,
    #     soil_ph=sensor.ph_soil,
    #     perfect_irrigation_period="Morning (6 AM - 9 AM)" if sensor.temperature_weather > 20 else "Evening (6 PM - 9 PM)",
    #     last_irrigation_date=current_date - timedelta(days=random.randint(1, 7)),
    #     last_start_irrigation_hour=fake.time_object(),
    #     last_finish_irrigation_hour=fake.time_object(),
    #     used_water_irrigation=random.uniform(100, 5000),
    #     water_flow_sensor=5,
    #     notification_date=formatted_timestamp
    # )

    # NotificationsPerUser.objects.create(
    #     user=user,
    #     notification=notification,
    #     is_read=False
    # )

    # # Generate Alert based on conditions
    # alert_conditions = [
    #     {
    #         "condition": sensor.temperature_weather > 40,
    #         "name": "Extreme Heat Alert",
    #         "type": Alert.A_WT,
    #         "desc": f"Temperature reached {sensor.temperature_weather}°C. High risk of crop damage!",
    #         "condition_type": Alert.GREATER_THAN,
    #         "condition_nbr": 40
    #     },
    #     {
    #         "condition": sensor.soil_moisture_low < 15,
    #         "name": "Low Soil Moisture Alert",
    #         "type": Alert.A_H,
    #         "desc": f"Soil moisture dropped to {sensor.soil_moisture_low}%. Consider irrigating soon.",
    #         "condition_type": Alert.LESS_THAN,
    #         "condition_nbr": 15
    #     },
    #     {
    #         "condition": sensor.wind_speed > 30,
    #         "name": "Strong Wind Alert",
    #         "type": Alert.A_WS,
    #         "desc": f"Wind speed is {sensor.wind_speed:.2f} m/s. Risk of soil erosion and crop damage.",
    #         "condition_type": Alert.GREATER_THAN,
    #         "condition_nbr": 30
    #     }
    # ]

    # for condition in alert_conditions:
    #     if condition["condition"]:
    #         Alert.objects.create(
    #             name=condition["name"],
    #             type=condition["type"],
    #             description=condition["desc"],
    #             condition=condition["condition_type"],
    #             condition_nbr=condition["condition_nbr"],
    #             user=user
    #         )

    current_date += timedelta(days=1)

print(f"🎉 Successfully created sensor records, notifications, and alerts for {user.username}!")
