from django.db import models

class PhData(models.Model):
    timestamp = models.DateTimeField()
    ph = models.FloatField()

    def __str__(self):
        return f"{self.timestamp} - pH: {self.ph}"


class TemperatureData(models.Model):
    timestamp = models.DateTimeField()
    temperature = models.FloatField()

    def __str__(self):
        return f"{self.timestamp} - Temperature: {self.temperature}"


class SensorData(models.Model):
    timestamp = models.DateTimeField()
    depth = models.FloatField()
    humidity_20 = models.FloatField()
    humidity_40 = models.FloatField()
    humidity_60 = models.FloatField()
    irrigation = models.FloatField()

    def __str__(self):
        return f"{self.timestamp} - Depth: {self.depth}, Irrigation: {self.irrigation}"


class CumulData(models.Model):
    timestamp = models.DateTimeField()
    cumul = models.FloatField()

    def __str__(self):
        return f"{self.timestamp} - Cumulative: {self.cumul}"


class ConductivityData(models.Model):
    timestamp = models.DateTimeField()
    conductivity = models.FloatField()
    irrigation = models.IntegerField()

    def __str__(self):
        return f"{self.timestamp} - Conductivity: {self.conductivity}, Irrigation: {self.irrigation}"

from django.conf import settings  
class DashboardSensorData(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField()
    air_temperature = models.FloatField()
    wetbulb_temperature = models.FloatField()
    solar_radiation = models.FloatField()
    vpd = models.FloatField()
    relative_humidity = models.FloatField()
    precipitation = models.FloatField()
    leaf_wetness = models.FloatField()
    wind_speed = models.FloatField()
    solar_panel_voltage = models.FloatField()
    battery_voltage = models.FloatField()
    delta_t = models.FloatField()
    sunshine_duration = models.FloatField()
    et0 = models.FloatField()

    def __str__(self):
        return f"{self.timestamp} - Air Temp: {self.air_temperature}, Solar Rad: {self.solar_radiation}, ET0: {self.et0}"


class StationData(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    timestamp = models.DateTimeField()
    et0 = models.FloatField()  # Evapotranspiration
    temperature = models.FloatField()  # Air temperature
    humidity = models.FloatField()  # Relative humidity
    wind_speed = models.FloatField()  # Wind speed
    wind_direction = models.FloatField()  # Wind direction (in degrees, for example)
    cumulative_rainfall = models.FloatField()  # Cumulative rainfall (pluvometric)
    solar_radiation = models.FloatField()  # Solar radiation
    vapor_pressure_deficit = models.FloatField()  # Deficit pressure of vapor
    precipitation = models.FloatField()  # Precipitation

    def __str__(self):
        return f"{self.timestamp} - Temp: {self.temperature}, Humidity: {self.humidity}, Wind Speed: {self.wind_speed}, ET0: {self.et0}"
