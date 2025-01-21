from rest_framework import serializers
from .models import Notification, Alert, NotificationsPerUser, AlertsPerUser, Sensor

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

    class Meta:
        model = Sensor
        fields = '__all__'
