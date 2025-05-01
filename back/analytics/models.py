
from datetime import datetime

from django.db.models.signals import post_save
from django.db import models
from django.conf import settings
from django.dispatch import receiver

from django.db import models
from django.contrib.auth.models import User

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
    user = models.ForeignKey(User,
        on_delete=models.CASCADE,
        related_name='user_notifications',
        null=True, blank=True  
    )
    
    def __str__(self):
        return f"Alert on {self.last_irrigation_date} (Notification sent on {self.notification_date})"


class Alert(models.Model):
    
    GREATER_THAN = '>'
    LESS_THAN = '<'
    EQUAL_TO = '='
    
    CONDITION_CHOICES = [
        (GREATER_THAN, 'Greater Than'),
        (LESS_THAN, 'Less Than'),
        (EQUAL_TO, 'Equal To'),
    ]
    
    
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

    
    name = models.CharField(max_length=200, help_text="A brief name for the alert.")
    type = models.CharField(
        max_length=50,
        choices=ALERT_CHOICES,
    )
    description = models.TextField(help_text="Detailed description of the alert.")
    
    
    condition = models.CharField(
        max_length=1,
        choices=CONDITION_CHOICES,
        help_text="The condition for this alert (>, <, =)"
    )
    condition_nbr = models.DecimalField(max_digits=7, decimal_places=0)
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_alerts',
        null=True, blank=True  
    )

    def __str__(self):
        return f"{self.name} - {self.condition}"


class Zone(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="zones")

    name = models.CharField(max_length=100)
    space = models.FloatField(help_text="Area in square meters.")

    # soil parameters
    soil_param_TAW = models.FloatField(help_text="Total Available Water (TAW) in mm.", default=50)
    soil_param_FC = models.FloatField(help_text="Field Capacity (FC) in %.", default=50)
    soil_param_WP = models.FloatField(help_text="Wilting Point (WP) in %.", default=50)
    soil_param_RAW = models.FloatField(help_text="Readily Available Water (RAW) in mm.", default=50)

    critical_moisture_threshold = models.FloatField(help_text="Critical soil moisture threshold in %.")
    
    # irrigation parameters [pomp flow rate auto or manual ?????]
    pomp_flow_rate = models.FloatField(help_text="Pump flow rate in liters per second.", default=100)
    irrigation_water_quantity = models.FloatField(help_text="Irrigation water quantity in liters.", default=100)


class KcPeriod(models.Model):
    period_name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    kc_value = models.FloatField(help_text="Kc value for this period.")

    def __str__(self):
        return f"{self.period_name} ({self.start_date} to {self.end_date})"


class Kc(models.Model):
    name = models.CharField(max_length=100, help_text="Name of the KC data set.", default="")
    plant_name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="kc_per_user")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="kc_values", null=True, blank=True)
    number_of_periods = models.IntegerField(help_text="Number of periods for which KC values are provided.", default=2)

    def __str__(self):
        return f"KC '{self.name}' for {self.plant_name} in Zone {self.zone.name} ({self.user.username})"



class KcPeriodAssignment(models.Model):
    kc = models.ForeignKey(Kc, on_delete=models.CASCADE, related_name="periods")
    period = models.ForeignKey(KcPeriod, on_delete=models.CASCADE, related_name="kc_assignments")

    def __str__(self):
        return f"Assignment of Period '{self.period.period_name}' to KC '{self.kc.name}'"


class PrecipitationRate(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="precipitation_rates")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="precipitation_rates_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Precipitation rate in mm/h.")
    timestamp = models.DateTimeField(help_text="Timestamp when the sensor data was recorded.")

    @property
    def default_unit(self) -> str:
        return "mm/h"

    @property
    def available_units(self) -> list[str]:
        return ["mm/h"]


class HumidityWeather(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="humidity_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="humidity_weather_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Humidity from the weather sensor as a percentage.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class WindSpeed(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="wind_speeds")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wind_speeds_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Wind speed in m/s.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "m/s"

    @property
    def available_units(self) -> list[str]:
        return ["m/s", "km/h"]


class SolarRadiation(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="solar_radiations")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="solar_radiations_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Solar radiation in W/m².")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "W/m²"

    @property
    def available_units(self) -> list[str]:
        return ["W/m²"]


class PressureWeather(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="pressure_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pressure_weather_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Atmospheric pressure in hPa.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "hPa"

    @property
    def available_units(self) -> list[str]:
        return ["hPa", "Pa", "atm"]


class WindDirection(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="wind_directions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wind_directions_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Wind direction in degrees.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°"

    @property
    def available_units(self) -> list[str]:
        return ["°"]


class TemperatureWeather(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="temperature_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="temperature_weather_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Air temperature in Celsius.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class ECSoilMedium(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_soil_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_soil_medium_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Electrical conductivity of soil at medium depth in dS/m.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "dS/m"

    @property
    def available_units(self) -> list[str]:
        return ["dS/m"]


class SoilTemperatureMedium(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_medium_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil temperature at medium depth in Celsius.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class SoilECHigh(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_ec_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_ec_high_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Electrical conductivity of soil at high depth in dS/m.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "dS/m"

    @property
    def available_units(self) -> list[str]:
        return ["dS/m"]


class ECSoilLow(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_soil_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_soil_low_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Electrical conductivity of soil at low depth in dS/m.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "dS/m"

    @property
    def available_units(self) -> list[str]:
        return ["dS/m"]


class SoilMoistureMedium(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_medium_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil moisture at medium depth in percentage.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class SoilMoistureHigh(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_high_per_user")
   
    value = models.FloatField(null=True, blank=True, help_text="Soil moisture at high depth in percentage.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class SoilMoistureLow(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_low_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil moisture at low depth in percentage.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class PhSoil(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ph_soil")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ph_soil_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil pH level.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "pH"

    @property
    def available_units(self) -> list[str]:
        return ["pH"]


class SoilTemperatureLow(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_low_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil temperature at low depth in Celsius.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class SoilTemperatureHigh(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_high_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil temperature at high depth in Celsius.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class WaterFlowSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="water_flow_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_flow_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Water flow sensor reading in liters per second.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "L/s"

    @property
    def available_units(self) -> list[str]:
        return ["L/s", "m³/h"]



class WaterECSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="water_ec_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_ec_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Water EC sensor reading in μS/cm.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "μS/cm"

    @property
    def available_units(self) -> list[str]:
        return ["μS/cm", "mS/cm"]


class PhWaterSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ph_water_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ph_water_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="pH level of water.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "pH"

    @property
    def available_units(self) -> list[str]:
        return ["pH"]


class ElectricityConsumptionSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="electricity_consumption_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="electricity_consumption_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Electricity consumption reading.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "kWh"

    @property
    def available_units(self) -> list[str]:
        return ["kWh", "Wh"]


class LeafMoistureSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="leaf_moisture_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leaf_moisture_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Leaf moisture percentage.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class MultiDepthSoilMoistureSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="multi_depth_soil_moisture_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="multi_depth_soil_moisture_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Multi-depth soil moisture percentage.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class LargeFruitDiameterSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="large_fruit_diameter_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="large_fruit_diameter_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Large fruit diameter size.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "mm"

    @property
    def available_units(self) -> list[str]:
        return ["mm", "cm"]


class WaterLevelSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="water_level_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_level_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Water level in the tank or river.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "cm"

    @property
    def available_units(self) -> list[str]:
        return ["cm", "m"]


class SoilSalinityConductivityIntegratedSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_salinity_conductivity_integrated_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_salinity_conductivity_integrated_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil salinity conductivity value.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "μS/cm"

    @property
    def available_units(self) -> list[str]:
        return ["μS/cm", "dS/m"]


class NpkSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="npk_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="npk_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Soil nutrient NPK reading.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "mg/kg"

    @property
    def available_units(self) -> list[str]:
        return ["mg/kg", "ppm"]


class FruitSizeSensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="fruit_size_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="fruit_size_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="Fruit size measurement.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "mm"

    @property
    def available_units(self) -> list[str]:
        return ["mm", "cm"]


class EcSalinitySensor(models.Model):
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_salinity_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_salinity_sensors_per_user")    
    value = models.FloatField(null=True, blank=True, help_text="EC and salinity measurement.")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "μS/cm"

    @property
    def available_units(self) -> list[str]:
        return ["μS/cm", "dS/m"]

 
class SensorColor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_sensor_colors')
    # zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="zone_sensor_colors")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="_graph_names", null=True, blank=True)


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

class SensorLocation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_sensor_locations')
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name='zone_sensor_locations')

    # Weather-related sensor locations
    precipitation_rate_longitude = models.FloatField()
    precipitation_rate_latitude = models.FloatField()

    humidity_weather_longitude = models.FloatField()
    humidity_weather_latitude = models.FloatField()

    wind_speed_longitude = models.FloatField()
    wind_speed_latitude = models.FloatField()

    solar_radiation_longitude = models.FloatField()
    solar_radiation_latitude = models.FloatField()

    pressure_weather_longitude = models.FloatField()
    pressure_weather_latitude = models.FloatField()

    wind_direction_longitude = models.FloatField()
    wind_direction_latitude = models.FloatField()

    temperature_weather_longitude = models.FloatField()
    temperature_weather_latitude = models.FloatField()

    # Soil-related sensor locations
    et0_longitude = models.FloatField()
    et0_latitude = models.FloatField()

    ec_soil_medium_longitude = models.FloatField()
    ec_soil_medium_latitude = models.FloatField()

    soil_temperature_medium_longitude = models.FloatField()
    soil_temperature_medium_latitude = models.FloatField()

    soil_ec_high_longitude = models.FloatField()
    soil_ec_high_latitude = models.FloatField()

    ec_soil_low_longitude = models.FloatField()
    ec_soil_low_latitude = models.FloatField()

    soil_moisture_medium_longitude = models.FloatField()
    soil_moisture_medium_latitude = models.FloatField()

    soil_moisture_high_longitude = models.FloatField()
    soil_moisture_high_latitude = models.FloatField()

    soil_moisture_low_longitude = models.FloatField()
    soil_moisture_low_latitude = models.FloatField()

    ph_soil_longitude = models.FloatField()
    ph_soil_latitude = models.FloatField()

    soil_temperature_low_longitude = models.FloatField()
    soil_temperature_low_latitude = models.FloatField()

    soil_temperature_high_longitude = models.FloatField()
    soil_temperature_high_latitude = models.FloatField()

    def __str__(self):
        return f"Sensor locations for {self.user.username} in {self.zone.name}"




class GraphName(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_graph_names')
    # zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="zone_graph_names")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="zone_graph_names", null=True, blank=True)


    
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


class ActiveGraph(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_active_graph')
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="zone_active_graph")

    # soil
    soil_irrigation_status =  models.BooleanField(default=True, help_text="Irrigation du sol")
    soil_ph_status =  models.BooleanField(default=True, help_text="pH du sol")
    soil_conductivity_status =  models.BooleanField(default=True, help_text="Conductivité du sol")
    soil_moisture_status =  models.BooleanField(default=True, help_text="Humidité du sol")
    soil_temperature_status =  models.BooleanField(default=True, help_text="Température du sol")
    
    # meteo
    et0_status =  models.BooleanField(default=True, help_text="Taux d'évapotranspiration")
    wind_speed_status =  models.BooleanField(default=True, help_text="Vitesse du vent")
    solar_radiation_status =  models.BooleanField(default=True, help_text="Rayonnement solaire")
    wind_direction_status =  models.BooleanField(default=True, help_text="Direction du vent")
    temperature_humidity_weather_status =  models.BooleanField(default=True, help_text="Température et humidité de l'air")
    precipitation_humidity_rate_status =  models.BooleanField(default=True, help_text="Taux de précipitation et humidité")
    pluviometrie_status =  models.BooleanField(default=True, help_text="Cumule de pluie tombée")
    data_table_status =  models.BooleanField(default=True, help_text="Tableau de données")


    def __str__(self):
        return f"Default Sensor Activation Settings (ID: {self.id})"