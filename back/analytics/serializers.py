from rest_framework import serializers
from .models import SensorColor, GraphName, Notification, Alert, NotificationsPerUser, Sensor

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'


class NotificationsPerUserSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    notification = NotificationSerializer()

    class Meta:
        model = NotificationsPerUser
        fields = '__all__'

class SensorSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    et0 = serializers.SerializerMethodField()
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")  # Format the timestamp

    def get_et0(self, obj):
        et0 = obj.ec_soil_medium * (obj.soil_moisture_medium / 100)  # Example formula
        return et0

    class Meta:
        model = Sensor
        fields = '__all__'

class GraphNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = GraphName
        # fields = '__all__'
        fields = [ 'soil_irrigation','soil_ph','soil_conductivity','soil_moisture','soil_temperature',
            'et0','precipitation_rate','wind_speed','solar_radiation','pressure_weather','wind_direction',
            'humidity_weather', 'temperature_weather', 'temperature_humidity_weather', 'precipitation_humidity_rate',
            'pluviometrie', 'data_table',]

class SensorColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorColor
        fields = [
        'precipitation_rate_color','humidity_weather_color','wind_speed_color',
        'solar_radiation_color','pressure_weather_color','wind_direction_color',
        'temperature_weather_color','et0_color','ec_soil_medium_color',
        'soil_temperature_medium_color','soil_ec_high_color','ec_soil_low_color',
        'soil_moisture_medium_color','soil_moisture_high_color','soil_moisture_low_color',
        'ph_soil_color','soil_temperature_low_color','soil_temperature_high_color',]
