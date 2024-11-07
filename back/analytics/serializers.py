from rest_framework import serializers
from .models import PhData, TemperatureData, SensorData, CumulData, ConductivityData, DashboardSensorData, StationData
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



class DashboardSensorDataSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = DashboardSensorData
        fields = [
            'id',
            'formatted_timestamp',
            'air_temperature',
            'wetbulb_temperature',
            'solar_radiation',
            'vpd',
            'relative_humidity',
            'precipitation',
            'leaf_wetness',
            'wind_speed',
            'solar_panel_voltage',
            'battery_voltage',
            'delta_t',
            'sunshine_duration',
            'et0',
        ]
    
    def get_formatted_timestamp(self, obj):
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')


class StationDataSerializer(serializers.ModelSerializer):
    formatted_timestamp = serializers.SerializerMethodField()

    class Meta:
        model = StationData
        fields = [
            'formatted_timestamp', 'et0', 'temperature', 'humidity',
            'wind_speed', 'wind_direction', 'cumulative_rainfall',
            'solar_radiation', 'vapor_pressure_deficit', 'precipitation'
        ]
    
    def get_formatted_timestamp(self, obj):
        # Custom format for the timestamp
        return obj.timestamp.strftime('%Y-%m-%d %H:%M')

from rest_framework import serializers
from .models import NotificationsPerUser, AlertsPerUser

class NotificationsPerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationsPerUser
        fields = ['id', 'notification', 'is_read', 'read_at']
        depth = 1  # Use depth to include related `Notification` details

class AlertsPerUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertsPerUser
        fields = ['id', 'alert', 'is_read', 'read_at']
        depth = 1  # Use depth to include related `Alert` details
