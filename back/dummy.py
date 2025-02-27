import os
import random
import django
from datetime import datetime, timedelta
from faker import Faker

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from django.contrib.auth import get_user_model
from analytics.models import Notification, Alert, NotificationsPerUser, AlertsPerUser, Sensor

# Initialize Faker
fake = Faker()

# User credentials
usernames = ['user1', 'user2', 'user3', 'user4']
password = "Pass123"

# Define date range for data
BEGIN_DATE = datetime(2023, 1, 1)  # Change as needed
END_DATE = datetime(2024, 2, 1)    # Change as needed

def random_date(start, end):
    """Generate a random datetime between `start` and `end`."""
    return start + timedelta(seconds=random.randint(0, int((end - start).total_seconds())))

# Create users
users = []
for username in usernames:
    user, created = get_user_model().objects.get_or_create(
        username=username,
        defaults={
            "email": fake.email(),
            "password": password,
            "firstname": fake.first_name(),
            "lastname": fake.last_name(),
            "phone_number": fake.phone_number(),
            "is_active": True,
            "is_staff": False
        }
    )
    users.append(user)

print(f"✅ Created {len(users)} users.")

# Create notifications
notifications = []
for _ in range(5):
    notification = Notification.objects.create(
        yesterday_temperature=random.randint(10, 40),
        today_temperature=random.randint(10, 40),
        yesterday_humidity=random.randint(20, 80),
        today_humidity=random.randint(20, 80),
        ET0=random.uniform(0, 10),
        soil_humidity=random.randint(10, 60),
        soil_temperature=random.randint(10, 35),
        soil_ph=random.uniform(5.0, 8.5),
        perfect_irrigation_period=fake.sentence(),
        last_irrigation_date=random_date(BEGIN_DATE, END_DATE).date(),
        last_start_irrigation_hour=fake.time(),
        last_finish_irrigation_hour=fake.time(),
        used_water_irrigation=random.randint(100, 500),
        notification_date=random_date(BEGIN_DATE, END_DATE).date()
    )
    notifications.append(notification)

print(f"✅ Created {len(notifications)} notifications.")

# Create alerts
alerts = []
for _ in range(3):
    alert = Alert.objects.create(
        title=fake.sentence(),
        description=fake.text(),
        danger_level=random.choice(['Low', 'Medium', 'High'])
    )
    alerts.append(alert)

print(f"✅ Created {len(alerts)} alerts.")

# Assign notifications and alerts to users
for user in users:
    for notification in random.sample(notifications, k=random.randint(1, len(notifications))):
        NotificationsPerUser.objects.create(
            user=user,
            notification=notification,
            is_read=random.choice([True, False]),
            read_at=random_date(BEGIN_DATE, END_DATE) if random.choice([True, False]) else None
        )

    for alert in random.sample(alerts, k=random.randint(1, len(alerts))):
        AlertsPerUser.objects.create(
            user=user,
            alert=alert,
            is_read=random.choice([True, False]),
            read_at=random_date(BEGIN_DATE, END_DATE) if random.choice([True, False]) else None
        )

print(f"✅ Assigned notifications and alerts to users.")

# Create sensor data for each user
for user in users:
    for _ in range(5):
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
            soil_temperature_high=random.randint(5, 30)
        )

print(f"✅ Created sensor data for users.")

print("🎉 Successfully created users and populated related data!")
