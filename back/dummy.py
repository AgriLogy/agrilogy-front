# import os
# import random
# import django
# from datetime import datetime, timedelta
# from faker import Faker

# # Set up Django environment
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
# django.setup()

# from django.core.exceptions import ObjectDoesNotExist
# from django.contrib.auth import get_user_model
# from CustomUser.models import CustomUser
# from analytics.models import Sensor, Notification, Alert, NotificationsPerUser, Zone

# # Initialize Faker
# fake = Faker()

# # Define date range for data
# BEGIN_DATE = datetime(year=2024, month=1, day=1)  # Change as needed
# END_DATE = datetime(year=2025, month=4, day=21)    # Change as needed

# # Get specific user
# try:
#     user = CustomUser.objects.get(username='user1')
# except ObjectDoesNotExist:
#     print("❌ User with username 'user1' does not exist.")
#     exit()

# print(f"✅ Found user: {user.username}")

# zone, _ = Zone.objects.get_or_create(
#     user=user,
#     name="zone de marichage 3",
#     defaults={
#         "space": 1750.0,
#         "kc": 15.0,
#         "soil_type": "clay",
#         "critical_moisture_threshold": 18.0,
#         "flow_rate": 1.0,
#     }
# )

# # Generate Sensor, Notification, and Alert records
# current_date = BEGIN_DATE
# while current_date <= END_DATE:
#     formatted_timestamp = current_date.strftime("%Y-%m-%d %H:%M:%S.%f")  
#     formatted_timestamp = datetime.strptime(formatted_timestamp, "%Y-%m-%d %H:%M:%S.%f")  

#     # Generate sensor data
#     sensor = Sensor.objects.create(
#         user=user,
#         zone=zone,
#         precipitation_rate=random.uniform(0, 100),
#         humidity_weather=random.randint(20, 100),
#         wind_speed=random.uniform(0, 50),
#         solar_radiation=random.uniform(100, 1000),
#         pressure_weather=random.uniform(900, 1100),
#         wind_direction=random.randint(0, 360),
#         temperature_weather=random.randint(-10, 45),
#         ec_soil_medium=random.uniform(0, 5),
#         soil_temperature_medium=random.randint(5, 30),
#         soil_ec_high=random.uniform(0, 5),
#         ec_soil_low=random.uniform(0, 5),
#         soil_moisture_medium=random.randint(10, 50),
#         soil_moisture_high=random.randint(10, 50),
#         soil_moisture_low=random.randint(10, 50),
#         ph_soil=random.uniform(5.0, 8.5),
#         soil_temperature_low=random.randint(5, 30),
#         soil_temperature_high=random.randint(5, 30),
#         timestamp=formatted_timestamp
#     )

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
    #     last_irrigation_date=(current_date - timedelta(days=random.randint(1, 7))),
    #     last_start_irrigation_hour=fake.time(),
    #     last_finish_irrigation_hour=fake.time(),
    #     used_water_irrigation=random.uniform(100, 5000),
    #     notification_date=formatted_timestamp
    # )

    # NotificationsPerUser.objects.create(
    #     user=user,
    #     notification=notification,
    #     is_read=False
    # )

    # Generate Alert based on conditions
    # alert = None
    # danger_level = "Low"

    # if sensor.temperature_weather > 40:
    #     danger_level = "High"
    #     title = "Extreme Heat Alert"
    #     description = f"Temperature reached {sensor.temperature_weather}°C. High risk of crop damage!"
    
    # elif sensor.soil_moisture_low < 15:
    #     danger_level = "Medium"
    #     title = "Low Soil Moisture Alert"
    #     description = f"Soil moisture dropped to {sensor.soil_moisture_low}%. Consider irrigating soon."
    
    # elif sensor.wind_speed > 30:
    #     danger_level = "Medium"
    #     title = "Strong Wind Alert"
    #     description = f"Wind speed is {sensor.wind_speed} m/s. Risk of soil erosion and crop damage."

    # if danger_level != "Low":
    #     alert = Alert.objects.create(
    #         title=title,
    #         description=description,
    #         danger_level=danger_level
    #     )


#     current_date += timedelta(days=1)

# print(f"🎉 Successfully created sensor records, notifications, and alerts for {user.username}!")


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

# Global parameters
NOTIFICATIONS_COUNT = 3  # Number of notifications to generate
START_DATE = datetime(2023, 1, 1)  # Start date for notification period
END_DATE = datetime(2023, 12, 31)  # End date for notification period

# Get specific user
try:
    user = CustomUser.objects.get(username='user1')
except ObjectDoesNotExist:
    print("❌ User with username 'user1' does not exist.")
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

# Generate notifications for the specified period
for i in range(NOTIFICATIONS_COUNT):
    # Randomly select a date within the specified range
    random_date = make_aware(START_DATE + timedelta(
        days=random.randint(0, (END_DATE - START_DATE).days)))

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
        notification_date=random_date
    )

    NotificationsPerUser.objects.create(
        user=user,
        notification=notification,
        is_read=False
    )

    print(f"🔔 Notification {i+1} created.")

print(f"✅ Successfully generated {NOTIFICATIONS_COUNT} notifications for user1.")
