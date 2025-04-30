from rest_framework import serializers
from .models import *


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'


class ZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zone
        fields = '__all__'


class KcPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = KcPeriod
        fields = '__all__'


class KcSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kc
        fields = '__all__'


class KcPeriodAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = KcPeriodAssignment
        fields = '__all__'


class PrecipitationRateSerializer(serializers.ModelSerializer):
    default_unit = serializers.CharField(source='default_unit', read_only=True)
    available_units = serializers.ListField(child=serializers.CharField(), source='available_units', read_only=True)

    class Meta:
        model = PrecipitationRate
        fields = [
            'id', 'name', 'courbe_color', 'longitude', 'latitude', 'value',
            'zone', 'user', 'timestamp', 'default_unit', 'available_units',
        ]


class HumidityWeatherSerializer(serializers.ModelSerializer):
    default_unit = serializers.CharField(source='default_unit', read_only=True)
    available_units = serializers.ListField(child=serializers.CharField(), source='available_units', read_only=True)

    class Meta:
        model = HumidityWeather
        fields = [
            'id', 'name', 'courbe_color', 'longitude', 'latitude', 'value',
            'zone', 'user', 'timestamp', 'default_unit', 'available_units',
        ]


class WindSpeedSerializer(serializers.ModelSerializer):
    default_unit = serializers.CharField(source='default_unit', read_only=True)
    available_units = serializers.ListField(child=serializers.CharField(), source='available_units', read_only=True)

    class Meta:
        model = WindSpeed
        fields = [
            'id', 'name', 'courbe_color', 'longitude', 'latitude', 'value',
            'zone', 'user', 'timestamp', 'default_unit', 'available_units',
        ]


class SolarRadiationSerializer(serializers.ModelSerializer):
    default_unit = serializers.CharField(source='default_unit', read_only=True)
    available_units = serializers.ListField(child=serializers.CharField(), source='available_units', read_only=True)

    class Meta:
        model = SolarRadiation
        fields = [
            'id', 'name', 'courbe_color', 'longitude', 'latitude', 'value',
            'zone', 'user', 'timestamp', 'default_unit', 'available_units',
        ]


class PressureWeatherSerializer(serializers.ModelSerializer):
    default_unit = serializers.CharField(source='default_unit', read_only=True)
    available_units = serializers.ListField(child=serializers.CharField(), source='available_units', read_only=True)

    class Meta:
        model = PressureWeather
        fields = [
            'id', 'name', 'courbe_color', 'longitude', 'latitude', 'value',
            'zone', 'user', 'timestamp', 'default_unit', 'available_units',
        ]


class WindDirectionSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = WindDirection
        fields = '__all__'


class TemperatureWeatherSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = TemperatureWeather
        fields = '__all__'


class ECSoilMediumSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = ECSoilMedium
        fields = '__all__'


class SoilTemperatureMediumSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilTemperatureMedium
        fields = '__all__'


class SoilECHighSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilECHigh
        fields = '__all__'


class ECSoilLowSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = ECSoilLow
        fields = '__all__'


from rest_framework import serializers
from .models import (
    WindDirection,
    TemperatureWeather,
    ECSoilMedium,
    SoilTemperatureMedium,
    SoilECHigh,
    ECSoilLow,
)

class WindDirectionSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = WindDirection
        fields = '__all__'


class TemperatureWeatherSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = TemperatureWeather
        fields = '__all__'


class ECSoilMediumSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = ECSoilMedium
        fields = '__all__'


class SoilTemperatureMediumSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilTemperatureMedium
        fields = '__all__'


class SoilECHighSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilECHigh
        fields = '__all__'


class ECSoilLowSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = ECSoilLow
        fields = '__all__'


class SoilMoistureMediumSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilMoistureMedium
        fields = '__all__'


class SoilMoistureHighSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilMoistureHigh
        fields = '__all__'


class SoilMoistureLowSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilMoistureLow
        fields = '__all__'


class PhSoilSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = PhSoil
        fields = '__all__'


class SoilTemperatureLowSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilTemperatureLow
        fields = '__all__'


class SoilTemperatureHighSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilTemperatureHigh
        fields = '__all__'


class WaterFlowSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = WaterFlowSensor
        fields = '__all__'


class WaterECSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = WaterECSensor
        fields = '__all__'


class PhWaterSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = PhWaterSensor
        fields = '__all__'


class ElectricityConsumptionSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = ElectricityConsumptionSensor
        fields = '__all__'


class LeafMoistureSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = LeafMoistureSensor
        fields = '__all__'


class MultiDepthSoilMoistureSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = MultiDepthSoilMoistureSensor
        fields = '__all__'


class LargeFruitDiameterSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = LargeFruitDiameterSensor
        fields = '__all__'


class WaterLevelSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = WaterLevelSensor
        fields = '__all__'


class SoilSalinityConductivityIntegratedSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = SoilSalinityConductivityIntegratedSensor
        fields = '__all__'


class NpkSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = NpkSensor
        fields = '__all__'


class FruitSizeSensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = FruitSizeSensor
        fields = '__all__'


class EcSalinitySensorSerializer(serializers.ModelSerializer):
    default_unit = serializers.ReadOnlyField()
    available_units = serializers.ReadOnlyField()

    class Meta:
        model = EcSalinitySensor
        fields = '__all__'
