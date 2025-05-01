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
    name="zone de marichage 3",
    space= 1750.0,
    defaults={
        "space": 1750.0,
        "critical_moisture_threshold": 18.0,
        "pomp_flow_rate": 1.0,
    }
)


# # Generate Sensor, Notification, and Alert records
# current_date = BEGIN_DATE
# while current_date <= END_DATE:
#     formatted_timestamp = current_date.strftime("%Y-%m-%d %H:%M:%S.%f")  
#     formatted_timestamp = datetime.strptime(formatted_timestamp, "%Y-%m-%d %H:%M:%S.%f")  



#     _PrecipitationRate = PrecipitationRate.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#     )
#     _HumidityWeather = HumidityWeather.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _WindSpeed = WindSpeed.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SolarRadiation = SolarRadiation.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _PressureWeather = PressureWeather.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _WindDirection = WindDirection.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _TemperatureWeather = TemperatureWeather.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _ECSoilMedium = ECSoilMedium.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilTemperatureMedium = SoilTemperatureMedium.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilECHigh = SoilECHigh.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _ECSoilLow = ECSoilLow.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilMoistureMedium = SoilMoistureMedium.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilMoistureHigh = SoilMoistureHigh.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilMoistureLow = SoilMoistureLow.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _PhSoil = PhSoil.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilTemperatureLow = SoilTemperatureLow.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilTemperatureHigh = SoilTemperatureHigh.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _WaterFlowSensor = WaterFlowSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _WaterECSensor = WaterECSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _PhWaterSensor = PhWaterSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _ElectricityConsumptionSensor = ElectricityConsumptionSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _LeafMoistureSensor = LeafMoistureSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _MultiDepthSoilMoistureSensor = MultiDepthSoilMoistureSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _LargeFruitDiameterSensor = LargeFruitDiameterSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _WaterLevelSensor = WaterLevelSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _SoilSalinityConductivityIntegratedSensor = SoilSalinityConductivityIntegratedSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _NpkSensor = NpkSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _FruitSizeSensor = FruitSizeSensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )
#     _EcSalinitySensor = EcSalinitySensor.objects.create(
#         user=user,
#         zone=zone,
#         value=random.uniform(0,100),
#         timestamp=formatted_timestamp
#         )


#     current_date += timedelta(days=1)


_ActiveGraph = ActiveGraph.objects.get_or_create(
    user=user,
    zone=zone,

)

print(f"🎉 Successfully created sensor records for {user.username}!")
