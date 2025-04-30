
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
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="zones")

    space = models.FloatField(help_text="Area in square meters.")
    soil_param_1 = models.FloatField(help_text="First soil identification parameter.", default=50)
    soil_param_2 = models.FloatField(help_text="Second soil identification parameter.", default=50)
    soil_param_3 = models.FloatField(help_text="Third soil identification parameter.", default=50)
    critical_moisture_threshold = models.FloatField(help_text="Critical soil moisture threshold in %.")  
    pomp_flow_rate = models.FloatField(help_text="Pump flow rate in liters per second.", default=100)
    irrigation_water_quantity = models.FloatField(help_text="Irrigation water quantity in liters.", default=100)

    def __str__(self):
        return f"Zone {self.name} for {self.user.username}"

    def identify_soil_type(self):
        if self.soil_param_1 > 70:
            return 'clay'
        elif self.soil_param_2 > 50:
            return 'loamy'
        elif self.soil_param_3 > 60:
            return 'sandy'
        else:
            return 'others'
        

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
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Precipitation rate in mm/h.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="precipitation_rates")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="precipitation_rates_per_user")
    timestamp = models.DateTimeField(help_text="Timestamp when the sensor data was recorded.")

    @property
    def default_unit(self) -> str:
        return "mm/h"

    @property
    def available_units(self) -> list[str]:
        return ["mm/h"]


class HumidityWeather(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Humidity from the weather sensor as a percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="humidity_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="humidity_weather_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class WindSpeed(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Wind speed in m/s.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="wind_speeds")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wind_speeds_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "m/s"

    @property
    def available_units(self) -> list[str]:
        return ["m/s", "km/h"]


class SolarRadiation(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Solar radiation in W/m².")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="solar_radiations")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="solar_radiations_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "W/m²"

    @property
    def available_units(self) -> list[str]:
        return ["W/m²"]


class PressureWeather(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Atmospheric pressure in hPa.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="pressure_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pressure_weather_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "hPa"

    @property
    def available_units(self) -> list[str]:
        return ["hPa", "Pa", "atm"]


class WindDirection(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Wind direction in degrees.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="wind_directions")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wind_directions_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°"

    @property
    def available_units(self) -> list[str]:
        return ["°"]


class TemperatureWeather(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Air temperature in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="temperature_weather")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="temperature_weather_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class ECSoilMedium(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Electrical conductivity of soil at medium depth in dS/m.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_soil_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_soil_medium_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "dS/m"

    @property
    def available_units(self) -> list[str]:
        return ["dS/m"]


class SoilTemperatureMedium(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil temperature at medium depth in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_medium_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class SoilECHigh(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Electrical conductivity of soil at high depth in dS/m.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_ec_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_ec_high_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "dS/m"

    @property
    def available_units(self) -> list[str]:
        return ["dS/m"]


class ECSoilLow(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Electrical conductivity of soil at low depth in dS/m.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_soil_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_soil_low_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "dS/m"

    @property
    def available_units(self) -> list[str]:
        return ["dS/m"]


class SoilMoistureMedium(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil moisture at medium depth in percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_medium")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_medium_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class SoilMoistureHigh(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil moisture at high depth in percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_high_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class SoilMoistureLow(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil moisture at low depth in percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_moisture_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_moisture_low_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class PhSoil(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil pH level.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ph_soil")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ph_soil_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "pH"

    @property
    def available_units(self) -> list[str]:
        return ["pH"]


class SoilTemperatureLow(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil temperature at low depth in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_low")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_low_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class SoilTemperatureHigh(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(help_text="Soil temperature at high depth in Celsius.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_temperature_high")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_temperature_high_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "°C"

    @property
    def available_units(self) -> list[str]:
        return ["°C", "°F"]


class WaterFlowSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Water flow sensor reading in liters per second.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="water_flow_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_flow_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "L/s"

    @property
    def available_units(self) -> list[str]:
        return ["L/s", "m³/h"]



class WaterECSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Water EC sensor reading in μS/cm.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="water_ec_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_ec_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "μS/cm"

    @property
    def available_units(self) -> list[str]:
        return ["μS/cm", "mS/cm"]


class PhWaterSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="pH level of water.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ph_water_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ph_water_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "pH"

    @property
    def available_units(self) -> list[str]:
        return ["pH"]


class ElectricityConsumptionSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Electricity consumption reading.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="electricity_consumption_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="electricity_consumption_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "kWh"

    @property
    def available_units(self) -> list[str]:
        return ["kWh", "Wh"]


class LeafMoistureSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Leaf moisture percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="leaf_moisture_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="leaf_moisture_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class MultiDepthSoilMoistureSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Multi-depth soil moisture percentage.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="multi_depth_soil_moisture_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="multi_depth_soil_moisture_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "%"

    @property
    def available_units(self) -> list[str]:
        return ["%"]


class LargeFruitDiameterSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Large fruit diameter size.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="large_fruit_diameter_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="large_fruit_diameter_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "mm"

    @property
    def available_units(self) -> list[str]:
        return ["mm", "cm"]


class WaterLevelSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Water level in the tank or river.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="water_level_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="water_level_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "cm"

    @property
    def available_units(self) -> list[str]:
        return ["cm", "m"]


class SoilSalinityConductivityIntegratedSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Soil salinity conductivity value.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="soil_salinity_conductivity_integrated_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="soil_salinity_conductivity_integrated_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "μS/cm"

    @property
    def available_units(self) -> list[str]:
        return ["μS/cm", "dS/m"]


class NpkSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Soil nutrient NPK reading.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="npk_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="npk_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "mg/kg"

    @property
    def available_units(self) -> list[str]:
        return ["mg/kg", "ppm"]


class FruitSizeSensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="Fruit size measurement.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="fruit_size_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="fruit_size_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "mm"

    @property
    def available_units(self) -> list[str]:
        return ["mm", "cm"]


class EcSalinitySensor(models.Model):
    name = models.CharField(max_length=255, default="")
    courbe_color = models.CharField(max_length=100, default="#000000")
    longitude = models.FloatField()
    latitude = models.FloatField()
    value = models.FloatField(null=True, blank=True, help_text="EC and salinity measurement.")
    zone = models.ForeignKey(Zone, on_delete=models.CASCADE, related_name="ec_salinity_sensors")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ec_salinity_sensors_per_user")
    timestamp = models.DateTimeField()

    @property
    def default_unit(self) -> str:
        return "μS/cm"

    @property
    def available_units(self) -> list[str]:
        return ["μS/cm", "dS/m"]