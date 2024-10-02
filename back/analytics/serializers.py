from rest_framework import serializers
from .models import PhData, TemperatureData, SensorData, CumulData, ConductivityData

class PhDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhData
        fields = '__all__'


class TemperatureDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TemperatureData
        fields = '__all__'


class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = '__all__'


class CumulDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CumulData
        fields = '__all__'


class ConductivityDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConductivityData
        fields = '__all__'

class AllDataSerializer(serializers.Serializer):
    ph_data = PhDataSerializer(many=True)
    temperature_data = TemperatureDataSerializer(many=True)
    sensor_data = SensorDataSerializer(many=True)
    cumul_data = CumulDataSerializer(many=True)
    conductivity_data = ConductivityDataSerializer(many=True)