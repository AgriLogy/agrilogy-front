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


class DashboardSensorData(models.Model):
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