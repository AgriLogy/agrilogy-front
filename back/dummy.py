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
from analytics.models import *

# Initialize Faker
fake = Faker()

# Define date range for data
BEGIN_DATE = datetime(year=2025, month=1, day=1)  # Change as needed
END_DATE = datetime(year=2025, month=4, day=30)    # Change as needed


try:
    user, created = CustomUser.objects.get_or_create(
        username='user1',
        defaults={
            'firstname': 'John',
            'lastname': 'Doe',
            'email': 'john.doe@example.com',
            'phone_number': '1234567890',
            'payement_status': 'actif',
            'is_active': True,
            'is_staff': False,
            'is_superuser': False
        }
    )

    if created:
        user.set_password('MKSzak123')
        user.save()
except Exception as e:
    print(f"❌ An error occurred while creating or getting the user: {e}")
    exit()


print(f"✅ Found user: {user.username}")


zone, _ = Zone.objects.get_or_create(
    user=user,
    name="zone de marichage 2",
    space= 1750.0,
    defaults={
        "space": 1750.0,
        "critical_moisture_threshold": 18.0,
        "pomp_flow_rate": 1.0,
    }
)



print(f"✅ Found or created zone: {zone.name}")

# Generate dummy FruitSizeSensor data
print("📊 Generating FruitSizeSensor data...")

def generate_random_datetimes(start: datetime, end: datetime, count: int):
    """Return a list of evenly spaced datetime points between start and end."""
    delta = (end - start) / count
    return [start + i * delta for i in range(count)]

try:
    data_points = 50  # Number of dummy records
    timestamps = generate_random_datetimes(BEGIN_DATE, END_DATE, data_points)

    for timestamp in timestamps:
        FruitSizeSensor.objects.create(
            zone=zone,
            user=user,
            value=round(random.uniform(10.0, 70.0), 2),  # Fruit size in mm
            timestamp=timestamp,
            color="#82ca9d"
        )
    print(f"✅ Created {data_points} FruitSizeSensor records.")
except Exception as e:
    print(f"❌ Failed to create FruitSizeSensor data: {e}")

print(f"🎉 Successfully created sensor records for {user.username}!")