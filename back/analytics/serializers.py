from rest_framework import serializers
from .models import SensorColor, GraphName, Notification, Alert, NotificationsPerUser, AlertsPerUser, Sensor

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


class AlertsPerUserSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    alert = AlertSerializer()

    class Meta:
        model = AlertsPerUser
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
        fields = '__all__'

class GraphColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorColor
        fields = '__all__'
