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

def create_user1_zone1():
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
    return user, zone


def generate_random_datetimes(start: datetime, end: datetime, count: int):
    """Return a list of evenly spaced datetime points between start and end."""
    delta = (end - start) / count
    return [start + i * delta for i in range(count)]


def SensorDataGenerator(model_class, sensor_name: str, color="#543141"):
    print(f"📊 Generating {sensor_name} data...")
    try:
        data_points = 50  # Number of dummy records
        timestamps = generate_random_datetimes(BEGIN_DATE, END_DATE, data_points)

        for timestamp in timestamps:
            model_class.objects.create(
                zone=zone,
                user=user,
                value=round(random.uniform(10.0, 70.0), 2),
                timestamp=timestamp,
            )
        print(f"✅ Created {data_points} {sensor_name} records.")
    except Exception as e:
        print(f"❌ Failed to create {sensor_name} data: {e}")

    print(f"🎉 Successfully created {sensor_name} records for {user.username}!")


def NpkSensorGenerator():
    NpkSensor.objects.filter(user=user, zone=zone).delete()
    print("🧹 Cleared existing NpkSensor records.")

    # Generate new NPK sensor data
    print("📊 Generating NpkSensor data...")

    try:
        data_points = 50
        timestamps = generate_random_datetimes(BEGIN_DATE, END_DATE, data_points)

        for timestamp in timestamps:
            NpkSensor.objects.create(
                zone=zone,
                user=user,
                timestamp=timestamp,

                nitrogen_value=round(random.uniform(30.0, 70.0), 2),
                nitrogen_color="#dba800",
                nitrogen_courbe_name="N_curve",

                phosphorus_value=round(random.uniform(10.0, 40.0), 2),
                phosphorus_color="#00a86b",
                phosphorus_courbe_name="P_curve",

                potassium_value=round(random.uniform(20.0, 60.0), 2),
                potassium_color="#4682b4",
                potassium_courbe_name="K_curve",
            )

        print(f"✅ Created {data_points} NpkSensor records.")
    except Exception as e:
        print(f"❌ Failed to create NpkSensor data: {e}")
        

user, zone = create_user1_zone1()

NpkSensorGenerator()

# SensorDataGenerator( Notification, "Notification")
# SensorDataGenerator( Alert, "Alert")
# SensorDataGenerator( Zone, "Zone")
# SensorDataGenerator( KcPeriod, "KcPeriod")
# SensorDataGenerator( Kc, "Kc")
# SensorDataGenerator( KcPeriodAssignment, "KcPeriodAssignment")
# SensorDataGenerator( Et0Calculated, "Et0Calculated")
# SensorDataGenerator( Et0Weather, "Et0Weather")
# SensorDataGenerator( PrecipitationRate, "PrecipitationRate")
# SensorDataGenerator( HumidityWeather, "HumidityWeather")
# SensorDataGenerator( WindSpeed, "WindSpeed")
# SensorDataGenerator( SolarRadiation, "SolarRadiation")
# SensorDataGenerator( PressureWeather, "PressureWeather")
# SensorDataGenerator( WindDirection, "WindDirection")
# SensorDataGenerator( TemperatureWeather, "TemperatureWeather")
# SensorDataGenerator( ECSoilMedium, "ECSoilMedium")
# SensorDataGenerator( SoilTemperatureMedium, "SoilTemperatureMedium")
# SensorDataGenerator( ECSoilHigh, "ECSoilHigh")
# SensorDataGenerator( ECSoilLow, "ECSoilLow")
# SensorDataGenerator( SoilMoistureMedium, "SoilMoistureMedium")
# SensorDataGenerator( SoilMoistureHigh, "SoilMoistureHigh")
# SensorDataGenerator( SoilMoistureLow, "SoilMoistureLow")
# SensorDataGenerator( PhSoil, "PhSoil")
# SensorDataGenerator( SoilTemperatureLow, "SoilTemperatureLow")
# SensorDataGenerator( SoilTemperatureHigh, "SoilTemperatureHigh")
# SensorDataGenerator( WaterFlowSensor, "WaterFlowSensor")
# SensorDataGenerator( WaterPressureSensor, "WaterPressureSensor")
# SensorDataGenerator( WaterECSensor, "WaterECSensor")
# SensorDataGenerator( PhWaterSensor, "PhWaterSensor")
# SensorDataGenerator( ElectricityConsumptionSensor, "ElectricityConsumptionSensor")
# SensorDataGenerator( LeafMoistureSensor, "LeafMoistureSensor")
# SensorDataGenerator( LeafTemperatureSensor, "LeafTemperatureSensor")
# SensorDataGenerator( MultiDepthSoilMoistureSensor, "MultiDepthSoilMoistureSensor")
# SensorDataGenerator( LargeFruitDiameterSensor, "LargeFruitDiameterSensor")
# SensorDataGenerator( WaterLevelSensor, "WaterLevelSensor")
# SensorDataGenerator( SoilSalinitySensor, "SoilSalinitySensor")
# SensorDataGenerator( SoilConductivitySensor, "SoilConductivitySensor")
# # SensorDataGenerator( NpkSensor, "NpkSensor")
# SensorDataGenerator( FruitSizeSensor, "FruitSizeSensor")
# SensorDataGenerator( EcSalinitySensor, "EcSalinitySensor")
# SensorDataGenerator( SensorColor, "SensorColor")
# SensorDataGenerator( SensorLocation, "SensorLocation")
# SensorDataGenerator( GraphName, "GraphName")
# SensorDataGenerator( ActiveGraph, "ActiveGraph")