import os
import random
from datetime import datetime, timedelta
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project_name.settings')
django.setup()

from analytics.models import PhData, TemperatureData, SensorData, CumulData, ConductivityData

def generate_random_data():
    # Set the starting date for the simulation
    start_date = datetime.now() - timedelta(days=30)
    # Create a list to hold all the timestamps
    timestamps = [start_date + timedelta(hours=i) for i in range(24 * 30)]  # 24 hours for 30 days

    for timestamp in timestamps:
        # Generate random pH data
        ph = round(random.uniform(6.0, 8.0), 2)  # pH typically ranges from 6.0 to 8.0
        PhData.objects.create(timestamp=timestamp, ph=ph)

        # Generate random temperature data
        temperature = round(random.uniform(15.0, 35.0), 2)  # Temperature in Celsius
        TemperatureData.objects.create(timestamp=timestamp, temperature=temperature)

        # Generate random sensor data
        depth = round(random.uniform(0.0, 100.0), 2)  # Depth in cm
        humidity_20 = round(random.uniform(20.0, 80.0), 2)
        humidity_40 = round(random.uniform(20.0, 80.0), 2)
        humidity_60 = round(random.uniform(20.0, 80.0), 2)
        irrigation = round(random.uniform(0.0, 100.0), 2)  # Irrigation percentage
        SensorData.objects.create(
            timestamp=timestamp,
            depth=depth,
            humidity_20=humidity_20,
            humidity_40=humidity_40,
            humidity_60=humidity_60,
            irrigation=irrigation
        )

        # Generate random cumulative data
        cumul = round(random.uniform(0.0, 1000.0), 2)  # Cumulative in arbitrary units
        CumulData.objects.create(timestamp=timestamp, cumul=cumul)

        # Generate random conductivity data
        conductivity = round(random.uniform(0.0, 5.0), 2)  # Conductivity in mS/cm
        irrigation = random.randint(0, 1)  # Binary irrigation flag
        ConductivityData.objects.create(timestamp=timestamp, conductivity=conductivity, irrigation=irrigation)

if __name__ == "__main__":
    generate_random_data()
    print("Random data generation complete.")
