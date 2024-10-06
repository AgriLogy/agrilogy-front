import os
import random
from datetime import datetime, timedelta
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriBack.settings')
django.setup()

from analytics.models import PhData, TemperatureData, SensorData, CumulData, ConductivityData, DashboardSensorData, StationData

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
        irrigation_flag = random.randint(0, 1)  # Binary irrigation flag
        ConductivityData.objects.create(timestamp=timestamp, conductivity=conductivity, irrigation=irrigation_flag)

        # Generate random dashboard sensor data
        air_temperature = round(random.uniform(15.0, 35.0), 2)  # Air temperature in °C
        wetbulb_temperature = round(random.uniform(10.0, 30.0), 2)  # Wetbulb temperature in °C
        solar_radiation = round(random.uniform(0.0, 1000.0), 2)  # Solar radiation in W/m²
        vpd = round(random.uniform(0.0, 5.0), 2)  # VPD in kPa
        relative_humidity = round(random.uniform(0.0, 100.0), 2)  # Relative humidity in %
        precipitation = round(random.uniform(0.0, 50.0), 2)  # Precipitation in mm
        leaf_wetness = round(random.uniform(0.0, 1.0), 2)  # Leaf wetness index
        wind_speed = round(random.uniform(0.0, 20.0), 2)  # Wind speed in m/s
        solar_panel_voltage = round(random.uniform(0.0, 100.0), 2)  # Solar panel voltage in V
        battery_voltage = round(random.uniform(0.0, 15.0), 2)  # Battery voltage in V
        delta_t = round(random.uniform(-5.0, 5.0), 2)  # Delta T in °C
        sunshine_duration = round(random.uniform(0.0, 24.0), 2)  # Sunshine duration in hours
        et0 = round(random.uniform(0.0, 10.0), 2)  # ET0 in mm/day

        DashboardSensorData.objects.create(
            timestamp=timestamp,
            air_temperature=air_temperature,
            wetbulb_temperature=wetbulb_temperature,
            solar_radiation=solar_radiation,
            vpd=vpd,
            relative_humidity=relative_humidity,
            precipitation=precipitation,
            leaf_wetness=leaf_wetness,
            wind_speed=wind_speed,
            solar_panel_voltage=solar_panel_voltage,
            battery_voltage=battery_voltage,
            delta_t=delta_t,
            sunshine_duration=sunshine_duration,
            et0=et0
        )

        # Insert data into StationData model
        wind_direction = round(random.uniform(0.0, 360.0), 2)  # Wind direction in degrees
        cumulative_rainfall = round(random.uniform(0.0, 100.0), 2)  # Cumulative rainfall (pluvometric)
        vapor_pressure_deficit = round(random.uniform(0.0, 10.0), 2)  # Vapor pressure deficit in kPa
        
        StationData.objects.create(
            timestamp=timestamp,
            et0=et0,
            temperature=air_temperature,
            humidity=relative_humidity,
            wind_speed=wind_speed,
            wind_direction=wind_direction,
            cumulative_rainfall=cumulative_rainfall,
            solar_radiation=solar_radiation,
            vapor_pressure_deficit=vapor_pressure_deficit,
            precipitation=precipitation
        )

if __name__ == "__main__":
    generate_random_data()
    print("Random data generation complete.")
