from rest_framework import serializers
from .models import *

class PrecipitationRateSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = PrecipitationRate
        fields = '__all__'

class HumidityWeatherSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = HumidityWeather
        fields = '__all__'

class WindSpeedSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = WindSpeed
        fields = '__all__'

class SolarRadiationSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SolarRadiation
        fields = '__all__'

class PressureWeatherSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = PressureWeather
        fields = '__all__'

class WindDirectionSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = WindDirection
        fields = '__all__'

class TemperatureWeatherSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = TemperatureWeather
        fields = '__all__'

class ECSoilMediumSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = ECSoilMedium
        fields = '__all__'

class SoilTemperatureMediumSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilTemperatureMedium
        fields = '__all__'

class SoilECHighSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilECHigh
        fields = '__all__'

class ECSoilLowSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = ECSoilLow
        fields = '__all__'

class SoilMoistureMediumSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilMoistureMedium
        fields = '__all__'

class SoilMoistureHighSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilMoistureHigh
        fields = '__all__'

class SoilMoistureLowSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilMoistureLow
        fields = '__all__'

class PhSoilSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = PhSoil
        fields = '__all__'

class SoilTemperatureLowSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilTemperatureLow
        fields = '__all__'

class SoilTemperatureHighSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilTemperatureHigh
        fields = '__all__'

class WaterFlowSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = WaterFlowSensor
        fields = '__all__'

class WaterECSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = WaterECSensor
        fields = '__all__'

class PhWaterSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = PhWaterSensor
        fields = '__all__'

class ElectricityConsumptionSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = ElectricityConsumptionSensor
        fields = '__all__'

class LeafMoistureSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = LeafMoistureSensor
        fields = '__all__'

class MultiDepthSoilMoistureSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = MultiDepthSoilMoistureSensor
        fields = '__all__'

class LargeFruitDiameterSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = LargeFruitDiameterSensor
        fields = '__all__'

class WaterLevelSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = WaterLevelSensor
        fields = '__all__'

class SoilSalinityConductivityIntegratedSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = SoilSalinityConductivityIntegratedSensor
        fields = '__all__'

class NpkSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = NpkSensor
        fields = '__all__'

class FruitSizeSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

    class Meta:
        model = FruitSizeSensor
        fields = '__all__'

class EcSalinitySensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")

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

class ActiveGraphSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiveGraph
        exclude = ['id']

class ZonesNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = ['id', 'name']