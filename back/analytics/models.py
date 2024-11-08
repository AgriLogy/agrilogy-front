from CustomUser.models import CustomUser
from django.db import models
from django.conf import settings  


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

from django.db import models
from datetime import datetime

class Notification(models.Model):
    # Temperatures
    yesterday_temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Temperature recorded yesterday in Celsius.")
    today_temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Temperature recorded today in Celsius.")
    
    # Humidity
    yesterday_humidity = models.DecimalField(max_digits=5, decimal_places=2, help_text="Humidity recorded yesterday as a percentage.")
    today_humidity = models.DecimalField(max_digits=5, decimal_places=2, help_text="Humidity recorded today as a percentage.")
    
    # ET0 (Evapotranspiration)
    ET0 = models.DecimalField(max_digits=6, decimal_places=2, help_text="Reference evapotranspiration in mm/day.")
    
    # Soil conditions
    soil_humidity = models.DecimalField(max_digits=5, decimal_places=2, help_text="Soil humidity percentage.")
    soil_temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Soil temperature in Celsius.")
    soil_ph = models.DecimalField(max_digits=4, decimal_places=2, help_text="Soil pH level.")
    
    # Irrigation details
    perfect_irrigation_period = models.CharField(max_length=100, help_text="Ideal time period for irrigation.")
    last_irrigation_date = models.DateField(help_text="Date of the last irrigation.")
    last_start_irrigation_hour = models.TimeField(help_text="Start time of the last irrigation.")
    last_finish_irrigation_hour = models.TimeField(help_text="Finish time of the last irrigation.")
    used_water_irrigation = models.DecimalField(max_digits=7, decimal_places=2, help_text="Water used in the last irrigation in liters.")
    
    # Notification date (new field)
    notification_date = models.DateTimeField(default=datetime.now, help_text="Date and time when the notification was created.")
    
    def __str__(self):
        return f"Alert on {self.last_irrigation_date} (Notification sent on {self.notification_date})"


class Alert(models.Model):
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'
    DANGER_LEVEL_CHOICES = [
        (LOW, 'Low'),
        (MEDIUM, 'Medium'),
        (HIGH, 'High'),
    ]

    title = models.CharField(max_length=200, help_text="A brief title for the alert.")
    description = models.TextField(help_text="Detailed description of the alert.")
    danger_level = models.CharField(
        max_length=6,
        choices=DANGER_LEVEL_CHOICES,
        default=LOW,
        help_text="Indicates the severity of the alert (Low, Medium, High)."
    )

    def __str__(self):
        return f"{self.title} - {self.danger_level}"


class NotificationsPerUser(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_notifications')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False, help_text="Whether the user has read this notification")
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.notification.title}"


class AlertsPerUser(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_alerts')
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False, help_text="Whether the user has read this alert")
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.alert.title}"