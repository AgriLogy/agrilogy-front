from django.db import models
from django.conf import settings
from datetime import datetime

# User table remains as it is in your CustomUser.models module.

class Notification(models.Model):
    yesterday_temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Temperature recorded yesterday in Celsius.")
    today_temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Temperature recorded today in Celsius.")
    yesterday_humidity = models.DecimalField(max_digits=5, decimal_places=2, help_text="Humidity recorded yesterday as a percentage.")
    today_humidity = models.DecimalField(max_digits=5, decimal_places=2, help_text="Humidity recorded today as a percentage.")
    ET0 = models.DecimalField(max_digits=6, decimal_places=2, help_text="Reference evapotranspiration in mm/day.")
    soil_humidity = models.DecimalField(max_digits=5, decimal_places=2, help_text="Soil humidity percentage.")
    soil_temperature = models.DecimalField(max_digits=5, decimal_places=2, help_text="Soil temperature in Celsius.")
    soil_ph = models.DecimalField(max_digits=4, decimal_places=2, help_text="Soil pH level.")
    perfect_irrigation_period = models.CharField(max_length=100, help_text="Ideal time period for irrigation.")
    last_irrigation_date = models.DateField(help_text="Date of the last irrigation.")
    last_start_irrigation_hour = models.TimeField(help_text="Start time of the last irrigation.")
    last_finish_irrigation_hour = models.TimeField(help_text="Finish time of the last irrigation.")
    used_water_irrigation = models.DecimalField(max_digits=7, decimal_places=2, help_text="Water used in the last irrigation in liters.")
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
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_notifications')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False, help_text="Whether the user has read this notification")
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - Notification on {self.notification.notification_date}"


class AlertsPerUser(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_alerts')
    alert = models.ForeignKey(Alert, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False, help_text="Whether the user has read this alert")
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - Alert: {self.alert.title}"


class Sensor(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_sensors')
    timestamp = models.DateTimeField(auto_now_add=True, help_text="Timestamp when the sensor data was recorded.")
    precipitation_rate = models.FloatField(help_text="Precipitation rate in mm/h.")
    humidity_weather = models.FloatField(help_text="Humidity from the weather sensor as a percentage.")
    wind_speed = models.FloatField(help_text="Wind speed in m/s.")
    solar_radiation = models.FloatField(help_text="Solar radiation in W/m².")
    pressure_weather = models.FloatField(help_text="Atmospheric pressure in hPa.")
    wind_direction = models.FloatField(help_text="Wind direction in degrees.")
    temperature_weather = models.FloatField(help_text="Air temperature in Celsius.")
    ec_soil_medium = models.FloatField(help_text="Electrical conductivity of soil at medium depth in dS/m.")
    soil_temperature_medium = models.FloatField(help_text="Soil temperature at medium depth in Celsius.")
    soil_ec_high = models.FloatField(help_text="Electrical conductivity of soil at high depth in dS/m.")
    ec_soil_low = models.FloatField(help_text="Electrical conductivity of soil at low depth in dS/m.")
    soil_moisture_medium = models.FloatField(help_text="Soil moisture at medium depth in percentage.")
    soil_moisture_high = models.FloatField(help_text="Soil moisture at high depth in percentage.")
    soil_moisture_low = models.FloatField(help_text="Soil moisture at low depth in percentage.")
    ph_soil = models.FloatField(help_text="Soil pH level.")
    soil_temperature_low = models.FloatField(help_text="Soil temperature at low depth in Celsius.")
    soil_temperature_high = models.FloatField(help_text="Soil temperature at high depth in Celsius.")

    def __str__(self):
        return f"{self.timestamp} - Sensors for {self.user.username}"
