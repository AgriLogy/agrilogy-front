from rest_framework import serializers
from .models import PhData, TemperatureData, SensorData, CumulData, ConductivityData
from django.utils import timezone

class PhDataSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = PhData
        fields = ['id', 'formatted_timestamp', 'ph']

    def get_formatted_timestamp(self, obj):
        # return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')


class TemperatureDataSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = TemperatureData
        fields = ['id', 'formatted_timestamp', 'temperature']

    def get_formatted_timestamp(self, obj):
        # return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')


class SensorDataSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = SensorData
        fields = ['id', 'formatted_timestamp', 'depth', 'humidity_20', 'humidity_40', 'humidity_60', 'irrigation']

    def get_formatted_timestamp(self, obj):
        # return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')


class CumulDataSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = CumulData
        fields = ['id', 'formatted_timestamp', 'cumul']

    def get_formatted_timestamp(self, obj):
        # return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')


class ConductivityDataSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = ConductivityData
        fields = ['id', 'formatted_timestamp', 'conductivity', 'irrigation']

    def get_formatted_timestamp(self, obj):
        # return obj.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')
