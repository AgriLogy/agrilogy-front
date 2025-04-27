from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User

class Zone(models.Model):
    name = models.CharField(max_length=255)

class PrecipitationRate(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Precipitation rate in mm/h.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="precipitation_rates")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="precipitation_rates_per_user")
    timestamp = models.DateTimeField(help_text="Timestamp when the sensor data was recorded.")

class HumidityWeather(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Humidity from the weather sensor as a percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="humidity_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="humidity_weather_per_user")
    timestamp = models.DateTimeField()

class WindSpeed(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Wind speed in m/s.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="wind_speeds")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wind_speeds_per_user")
    timestamp = models.DateTimeField()

class SolarRadiation(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Solar radiation in W/m².")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="solar_radiations")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="solar_radiations_per_user")
    timestamp = models.DateTimeField()

class PressureWeather(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Atmospheric pressure in hPa.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="pressure_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pressure_weather_per_user")
    timestamp = models.DateTimeField()

class WindDirection(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Wind direction in degrees.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="wind_directions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wind_directions_per_user")
    timestamp = models.DateTimeField()

class TemperatureWeather(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Air temperature in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="temperature_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="temperature_weather_per_user")
    timestamp = models.DateTimeField()

class ECSoilMedium(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Electrical conductivity of soil at medium depth in dS/m.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_soil_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_soil_medium_per_user")
    timestamp = models.DateTimeField()

class SoilTemperatureMedium(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil temperature at medium depth in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_medium_per_user")
    timestamp = models.DateTimeField()

class SoilECHigh(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Electrical conductivity of soil at high depth in dS/m.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_ec_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_ec_high_per_user")
    timestamp = models.DateTimeField()

class ECSoilLow(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Electrical conductivity of soil at low depth in dS/m.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_soil_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_soil_low_per_user")
    timestamp = models.DateTimeField()

class SoilMoistureMedium(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil moisture at medium depth in percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_medium_per_user")
    timestamp = models.DateTimeField()

class SoilMoistureHigh(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil moisture at high depth in percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_high_per_user")
    timestamp = models.DateTimeField()

class SoilMoistureLow(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil moisture at low depth in percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_low_per_user")
    timestamp = models.DateTimeField()

class PhSoil(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil pH level.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ph_soil")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ph_soil_per_user")
    timestamp = models.DateTimeField()

class SoilTemperatureLow(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil temperature at low depth in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_low_per_user")
    timestamp = models.DateTimeField()

class SoilTemperatureHigh(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil temperature at high depth in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_high_per_user")
    timestamp = models.DateTimeField()

class WaterFlowSensor(models.Model):
    name = models.CharField(max_length=255)
    courbe_color = models.CharField(max_length=100)
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Water flow sensor reading in liters per second.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="water_flow_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_flow_sensors_per_user")
    timestamp = models.DateTimeField()
