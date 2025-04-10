
from datetime import datetime

from django.db.models.signals import post_save
from django.db import models
from django.conf import settings
from django.dispatch import receiver


User = settings.AUTH_USER_MODEL

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
    # Condition Choices
    GREATER_THAN = '>'
    LESS_THAN = '<'
    EQUAL_TO = '='
    
    CONDITION_CHOICES = [
        (GREATER_THAN, 'Greater Than'),
        (LESS_THAN, 'Less Than'),
        (EQUAL_TO, 'Equal To'),
    ]
    
    # Alert Type Choices
    A_P = "Pressure"
    A_F = "Flow"
    A_WT = "Weather Temperature"
    A_WS = "Wind Speed"
    A_RF = "Rain Fall"
    A_EC = "EC (Electrical Conductivity)"
    A_PH = "pH Level"
    A_H = "Humidity"
    A_ST = "Soil Temperature"
    A_PM = "Periodic maintenance"


    ALERT_CHOICES = [
        (A_P, "Pressure"),
        (A_F, "Flow"),
        (A_WT, "Weather Temperature"),
        (A_WS, "Wind Speed"),
        (A_RF, "Rain Fall"),
        (A_PM, "Periodic maintenance"),
        (A_EC, "EC (Electrical Conductivity)"),
        (A_PH, "pH Level"),
        (A_H, "Humidity"),
        (A_ST, "Soil Temperature"),
    ]

    # Fields for the Alert
    name = models.CharField(max_length=200, help_text="A brief name for the alert.")
    type = models.CharField(
        max_length=50,
        choices=ALERT_CHOICES,
    )
    description = models.TextField(help_text="Detailed description of the alert.")
    
    # Adding condition field
    condition = models.CharField(
        max_length=1,
        choices=CONDITION_CHOICES,
        help_text="The condition for this alert (>, <, =)"
    )
    condition_nbr = models.DecimalField(max_digits=7, decimal_places=0)
    # ForeignKey for User (optional)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_alerts',
        null=True, blank=True  # Optional field to associate the alert with a user
    )

    def __str__(self):
        return f"{self.name} - {self.condition}"




class NotificationsPerUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_notifications')
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    is_read = models.BooleanField(default=False, help_text="Whether the user has read this notification")
    read_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - Notification on {self.notification.notification_date}"


class Zone(models.Model):
        # Basic fields
        name = models.CharField(max_length=100)  # Example: "zone1", "zone2", etc.
        # location = models.CharField(max_length=255, blank=True, null=True)  # You can use this for additional info about the zone
        user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="zones")

        # Additional fields
        space = models.FloatField(help_text="The area of the zone in square meters.")  # Size of the zone
        kc = models.FloatField(help_text="The crop coefficient (kc) for the zone.")  # Crop coefficient (used in irrigation calculations)
        soil_type = models.CharField(max_length=50, choices=[('clay', 'Clay'), ('loamy', 'Loamy'), ('sandy', 'Sandy'), ('others', 'Others')], default='loamy', help_text="Type of soil in the zone.")
        critical_moisture_threshold = models.FloatField(help_text="Critical soil moisture threshold in percentage.")
        flow_rate = models.FloatField(help_text="Flow rate of water in liters per second.")

        def __str__(self):
            return f"Zone {self.name} for {self.user.username}"



        def __str__(self):
            return f"Zone {self.name} for {self.user.username}"

class Kc(models.Model):
    plant_name= models.CharField(max_length=100)
    kc_january = models.FloatField(help_text="Crop coefficient for the plant.")
    kc_january = models.FloatField(help_text="Crop coefficient for January.")
    kc_february = models.FloatField(help_text="Crop coefficient for February.")
    kc_march = models.FloatField(help_text="Crop coefficient for March.")
    kc_april = models.FloatField(help_text="Crop coefficient for April.")
    kc_may = models.FloatField(help_text="Crop coefficient for May.")
    kc_june = models.FloatField(help_text="Crop coefficient for June.")
    kc_july = models.FloatField(help_text="Crop coefficient for July.")
    kc_august = models.FloatField(help_text="Crop coefficient for August.")
    kc_september = models.FloatField(help_text="Crop coefficient for September.")
    kc_october = models.FloatField(help_text="Crop coefficient for October.")
    kc_november = models.FloatField(help_text="Crop coefficient for November.")
    kc_december = models.FloatField(help_text="Crop coefficient for December.")
    def __str__(self):
        return f"KC for {self.plant_name}"

class Kc_per_user_per_zone(models.Model):
    kc = models.ForeignKey(Kc, on_delete=models.CASCADE)
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return f"KC for in {self.zone.name} zone {self.username}" 

class ZonePerUser(models.Model):
        user = models.ForeignKey(User, on_delete=models.CASCADE)
        zone = models.ForeignKey(Zone, on_delete=models.CASCADE)
        
        def __str__(self):
            return f"Zone {self.zone.name} assigned to {self.user.username}"


class Sensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="Sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="Sensors_per_user")
    timestamp = models.DateTimeField(help_text="Timestamp when the sensor data was recorded.")
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
    water_flow_sensor = models.FloatField(null=True, blank=True, help_text="Water flow sensor reading in liters per second.")

    def __str__(self):
        return f"Sensor data for Zone {self.zone.name} at {self.timestamp}"


class GraphName(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_graph_names')
    
    soil_irrigation = models.CharField(max_length=40, default="Irrigation du sol")
    soil_ph = models.CharField(max_length=40, default="pH du sol")
    soil_conductivity = models.CharField(max_length=40, default="Conductivité du sol")
    soil_moisture = models.CharField(max_length=40, default="Humidité du sol")
    soil_temperature = models.CharField(max_length=40, default="Température du sol")
    
    et0 = models.CharField(max_length=40, default="Taux d'évapotranspiration")
    precipitation_rate = models.CharField(max_length=40, default="Taux de précipitation")
    wind_speed = models.CharField(max_length=40, default="Vitesse du vent")
    solar_radiation = models.CharField(max_length=40, default="Rayonnement solaire")
    pressure_weather = models.CharField(max_length=40, default="Pression atmosphérique")
    wind_direction = models.CharField(max_length=40, default="Direction du vent")
    humidity_weather = models.CharField(max_length=40, default="Humidité de l'air")
    temperature_weather = models.CharField(max_length=40, default="Température de l'air")
    temperature_humidity_weather = models.CharField(max_length=40, default="Température et humidité de l'air")
    precipitation_humidity_rate = models.CharField(max_length=40, default="Taux de précipitation et humidité")
    pluviometrie = models.CharField(max_length=40, default="Cumule de pluie tombée")
    data_table = models.CharField(max_length=40, default="Tableau de données")

    def __str__(self):
        return f"Noms des graphiques pour {self.user.username}"
    
class SensorColor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_sensor_colors')
    # Weather-related colors
    precipitation_rate_color = models.CharField(max_length=7, default="#3D8D7A")  # Teal
    humidity_weather_color = models.CharField(max_length=7, default="#2A6F97")  # Blue
    wind_speed_color = models.CharField(max_length=7, default="#FFB703")  # Yellow-Orange
    solar_radiation_color = models.CharField(max_length=7, default="#E63946")  # Red
    pressure_weather_color = models.CharField(max_length=7, default="#F4A261")  # Light Orange
    wind_direction_color = models.CharField(max_length=7, default="#6A0572")  # Purple
    temperature_weather_color = models.CharField(max_length=7, default="#E76F51")  # Warm Red

    # Soil-related colors
    et0_color = models.CharField(max_length=7, default="#497D74")  # Greenish-Blue
    ec_soil_medium_color = models.CharField(max_length=7, default="#2A9D8F")  # Greenish-Blue
    soil_temperature_medium_color = models.CharField(max_length=7, default="#264653")  # Dark Cyan
    soil_ec_high_color = models.CharField(max_length=7, default="#8A2BE2")  # Blue-Violet
    ec_soil_low_color = models.CharField(max_length=7, default="#D4A373")  # Earthy Beige
    soil_moisture_medium_color = models.CharField(max_length=7, default="#6D597A")  # Muted Purple
    soil_moisture_high_color = models.CharField(max_length=7, default="#C8553D")  # Deep Orange
    soil_moisture_low_color = models.CharField(max_length=7, default="#457B9D")  # Soft Blue
    ph_soil_color = models.CharField(max_length=7, default="#023E8A")  # Deep Blue
    soil_temperature_low_color = models.CharField(max_length=7, default="#8D99AE")  # Soft Gray-Blue
    soil_temperature_high_color = models.CharField(max_length=7, default="#E9C46A")  # Golden Yellow

    def __str__(self):
        return f"Graph colors for {self.user.username}"

@receiver(post_save, sender=User)
def create_graph_names(sender, instance, created, **kwargs):
    if created:
        GraphName.objects.create(user=instance)
        SensorColor.objects.create(user=instance)