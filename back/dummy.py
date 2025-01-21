import os
import random
import django
from datetime import datetime
from faker import Faker

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from django.contrib.auth import get_user_model
from analytics.models import Notification, Alert, NotificationsPerUser, AlertsPerUser, Sensor

password = "Pass123"
# Initialize Faker
fake = Faker()

# Create 10 users
users = []
for _ in range(10):
    user = get_user_model().objects.create_user(
        username=fake.user_name(),
        email=fake.email(),
        # password=fake.password(),
        password=password,
        firstname=fake.first_name(),
        lastname=fake.last_name(),
        phone_number=fake.phone_number(),
        user_type=random.choice(['admin', 'regular']),
        is_active=True,
        is_staff=False
    )
    users.append(user)

# Create 5 notifications and assign them to users
notifications = []
for _ in range(5):
    notification = Notification.objects.create(
        yesterday_temperature=fake.random_number(digits=2),
        today_temperature=fake.random_number(digits=2),
        yesterday_humidity=fake.random_number(digits=2),
        today_humidity=fake.random_number(digits=2),
        ET0=fake.random_number(digits=3),
        soil_humidity=fake.random_number(digits=2),
        soil_temperature=fake.random_number(digits=2),
        soil_ph=fake.random_number(digits=2),
        perfect_irrigation_period=fake.sentence(),
        last_irrigation_date=fake.date_this_year(),
        last_start_irrigation_hour=fake.time(),
        last_finish_irrigation_hour=fake.time(),
        used_water_irrigation=fake.random_number(digits=3),
        notification_date=fake.date_this_year()
    )
    notifications.append(notification)

# Create 3 alerts and assign them to users
alerts = []
for _ in range(3):
    alert = Alert.objects.create(
        title=fake.sentence(),
        description=fake.text(),
        danger_level=random.choice(['Low', 'Medium', 'High'])
    )
    alerts.append(alert)

# Link users to notifications and alerts
for user in users:
    # Assign random notifications to users
    for notification in notifications:
        NotificationsPerUser.objects.create(
            user=user,
            notification=notification,
            is_read=random.choice([True, False]),
            read_at=datetime.now() if random.choice([True, False]) else None
        )

    # Assign random alerts to users
    for alert in alerts:
        AlertsPerUser.objects.create(
            user=user,
            alert=alert,
            is_read=random.choice([True, False]),
            read_at=datetime.now() if random.choice([True, False]) else None
        )

# Create random sensor data for each user
for user in users:
    for _ in range(5):  # 5 sensor records per user
        Sensor.objects.create(
            user=user,
            precipitation_rate=fake.random_number(digits=2),
            humidity_weather=fake.random_number(digits=2),
            wind_speed=fake.random_number(digits=2),
            solar_radiation=fake.random_number(digits=3),
            pressure_weather=fake.random_number(digits=3),
            wind_direction=fake.random_number(digits=3),
            temperature_weather=fake.random_number(digits=2),
            ec_soil_medium=fake.random_number(digits=2),
            soil_temperature_medium=fake.random_number(digits=2),
            soil_ec_high=fake.random_number(digits=2),
            ec_soil_low=fake.random_number(digits=2),
            soil_moisture_medium=fake.random_number(digits=2),
            soil_moisture_high=fake.random_number(digits=2),
            soil_moisture_low=fake.random_number(digits=2),
            ph_soil=fake.random_number(digits=2),
            soil_temperature_low=fake.random_number(digits=2),
            soil_temperature_high=fake.random_number(digits=2)
        )

print('Successfully created 10 users and populated related data!')
