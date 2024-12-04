import os
import random
from datetime import datetime, timedelta
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from analytics.models import PhData, TemperatureData, SensorData, CumulData, ConductivityData, DashboardSensorData, StationData
from CustomUser.models import CustomUser
from analytics.models import Alert, AlertsPerUser, Notification, NotificationsPerUser
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

def create_users():
    # Create 10 users
    users = []
    for i in range(1, 5):
        username = f'user{i}'
        email = f'user{i}@example.com'
        password = 'Password123!'  # A valid password with proper complexity

        # Check if user already exists (optional, in case you run this multiple times)
        if CustomUser.objects.filter(email=email).exists() or CustomUser.objects.filter(username=username).exists():
            print(f'User {username} already exists, skipping creation.')
            user = CustomUser.objects.get(username=username)  # Fetch existing user
        else:
            try:
                # Validate the password
                validate_password(password)
                # Create the user
                user = CustomUser.objects.create_user(
                    username=username, 
                    email=email, 
                    password=password, 
                    firstname='User', 
                    lastname=str(i)
                )
                print(f'User {username} created successfully.')
            except ValidationError as e:
                print(f"Password validation failed for {username}: {e.messages}")
                continue

        users.append(user)
    return users

def generate_random_data(users):
    start_timestamp = datetime.now() - timedelta(days=30)  # Start from 30 days ago
    for user in users:
        for _ in range(10):  # Create 10 records for each user
            # Generate a random timestamp
            random_timestamp = start_timestamp + timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59))

            # Generate random values for each model and round to 2 decimal places
            ph_data = PhData.objects.create(timestamp=random_timestamp, ph=round(random.uniform(5.0, 9.0), 2))
            temperature_data = TemperatureData.objects.create(timestamp=random_timestamp, temperature=round(random.uniform(0.0, 40.0), 2))
            sensor_data = SensorData.objects.create(
                timestamp=random_timestamp,
                depth=round(random.uniform(0.0, 2.0), 2),
                humidity_20=round(random.uniform(0.0, 100.0), 2),
                humidity_40=round(random.uniform(0.0, 100.0), 2),
                humidity_60=round(random.uniform(0.0, 100.0), 2),
                irrigation=round(random.uniform(0.0, 100.0), 2)
            )
            cumul_data = CumulData.objects.create(timestamp=random_timestamp, cumul=round(random.uniform(0.0, 1000.0), 2))
            conductivity_data = ConductivityData.objects.create(
                timestamp=random_timestamp,
                conductivity=round(random.uniform(0.0, 10.0), 2),
                irrigation=random.randint(0, 1)  # 0 or 1 for irrigation status
            )
            dashboard_sensor_data = DashboardSensorData.objects.create(
                user=user,
                timestamp=random_timestamp,
                air_temperature=round(random.uniform(-10.0, 40.0), 2),
                wetbulb_temperature=round(random.uniform(-10.0, 40.0), 2),
                solar_radiation=round(random.uniform(0.0, 1000.0), 2),
                vpd=round(random.uniform(0.0, 5.0), 2),
                relative_humidity=round(random.uniform(0.0, 100.0), 2),
                precipitation=round(random.uniform(0.0, 50.0), 2),
                leaf_wetness=round(random.uniform(0.0, 100.0), 2),
                wind_speed=round(random.uniform(0.0, 20.0), 2),
                solar_panel_voltage=round(random.uniform(0.0, 60.0), 2),
                battery_voltage=round(random.uniform(0.0, 60.0), 2),
                delta_t=round(random.uniform(0.0, 10.0), 2),
                sunshine_duration=round(random.uniform(0.0, 24.0), 2),
                et0=round(random.uniform(0.0, 10.0), 2)
            )
            station_data = StationData.objects.create(
                user=user,
                timestamp=random_timestamp,
                et0=round(random.uniform(0.0, 10.0), 2),
                temperature=round(random.uniform(0.0, 40.0), 2),
                humidity=round(random.uniform(0.0, 100.0), 2),
                wind_speed=round(random.uniform(0.0, 20.0), 2),
                wind_direction=round(random.uniform(0.0, 360.0), 2),  # Wind direction in degrees
                cumulative_rainfall=round(random.uniform(0.0, 500.0), 2),
                solar_radiation=round(random.uniform(0.0, 1000.0), 2),
                vapor_pressure_deficit=round(random.uniform(0.0, 5.0), 2),
                precipitation=round(random.uniform(0.0, 50.0), 2)
            )

            print(f"Generated data for {user.username} at {random_timestamp}")

def create_alerts_and_notifications(users):
    for user in users:
        # Create 2 alerts per user
        for i in range(2):
            alert = Alert.objects.create(
                title=f"Alert {i + 1} for {user.username}",
                description="This is a test alert",
                danger_level=random.choice(['Low', 'Medium', 'High'])
            )
            AlertsPerUser.objects.create(user=user, alert=alert)
            print(f"Created alert {alert.title} for {user.username}")

        # Create 3 notifications per user
        for i in range(3):
            notification = Notification.objects.create(
                yesterday_temperature=round(random.uniform(10.0, 30.0), 2),
                today_temperature=round(random.uniform(10.0, 30.0), 2),
                yesterday_humidity=round(random.uniform(20.0, 80.0), 2),
                today_humidity=round(random.uniform(20.0, 80.0), 2),
                ET0=round(random.uniform(0.0, 10.0), 2),
                soil_humidity=round(random.uniform(0.0, 100.0), 2),
                soil_temperature=round(random.uniform(10.0, 30.0), 2),
                soil_ph=round(random.uniform(4.0, 9.0), 2),
                perfect_irrigation_period="Early Morning",
                last_irrigation_date=datetime.now().date(),
                last_start_irrigation_hour=datetime.now().time(),
                last_finish_irrigation_hour=(datetime.now() + timedelta(hours=1)).time(),
                used_water_irrigation=round(random.uniform(0.0, 1000.0), 2)
            )
            NotificationsPerUser.objects.create(user=user, notification=notification)
            print(f"Created notification for {user.username}")

if __name__ == "__main__":
    users = create_users()  # Create users first
    generate_random_data(users)  # Generate random sensor data for each user
    create_alerts_and_notifications(users)  # Create alerts and notifications
    print("Data generation complete.")
