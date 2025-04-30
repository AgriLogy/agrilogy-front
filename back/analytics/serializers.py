from rest_framework import serializers
from .models import *

class PrecipitationRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrecipitationRate
        fields = '__all__'

class HumidityWeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = HumidityWeather
        fields = '__all__'

class WindSpeedSerializer(serializers.ModelSerializer):
    class Meta:
        model = WindSpeed
        fields = '__all__'

class SolarRadiationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolarRadiation
        fields = '__all__'

class PressureWeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = PressureWeather
        fields = '__all__'

class WindDirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WindDirection
        fields = '__all__'

class TemperatureWeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemperatureWeather
        fields = '__all__'

class ECSoilMediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = ECSoilMedium
        fields = '__all__'

class SoilTemperatureMediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilTemperatureMedium
        fields = '__all__'

class SoilECHighSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilECHigh
        fields = '__all__'

class ECSoilLowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ECSoilLow
        fields = '__all__'

class SoilMoistureMediumSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilMoistureMedium
        fields = '__all__'

class SoilMoistureHighSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilMoistureHigh
        fields = '__all__'

class SoilMoistureLowSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilMoistureLow
        fields = '__all__'

class PhSoilSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhSoil
        fields = '__all__'

class SoilTemperatureLowSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilTemperatureLow
        fields = '__all__'

class SoilTemperatureHighSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilTemperatureHigh
        fields = '__all__'

class WaterFlowSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterFlowSensor
        fields = '__all__'

class WaterECSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterECSensor
        fields = '__all__'

class PhWaterSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhWaterSensor
        fields = '__all__'

class ElectricityConsumptionSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectricityConsumptionSensor
        fields = '__all__'

class LeafMoistureSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeafMoistureSensor
        fields = '__all__'

class MultiDepthSoilMoistureSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultiDepthSoilMoistureSensor
        fields = '__all__'

class LargeFruitDiameterSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = LargeFruitDiameterSensor
        fields = '__all__'

class WaterLevelSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterLevelSensor
        fields = '__all__'

class SoilSalinityConductivityIntegratedSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilSalinityConductivityIntegratedSensor
        fields = '__all__'

class NpkSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = NpkSensor
        fields = '__all__'

class FruitSizeSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = FruitSizeSensor
        fields = '__all__'

class EcSalinitySensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcSalinitySensor
        fields = '__all__'

# Graphe names for each user
class GraphNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraphName
        fields = '__all__'

class SensorColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorColor
        fields = '__all__'
