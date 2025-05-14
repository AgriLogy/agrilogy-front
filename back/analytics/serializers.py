from rest_framework import serializers
from .models import *

from rest_framework import serializers

class BaseSensorSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(format="%d-%m-%Y")
    default_unit = serializers.SerializerMethodField()
    available_units = serializers.SerializerMethodField()

    def get_default_unit(self, obj):
        return obj.default_unit

    def get_available_units(self, obj):
        return obj.available_units

    class Meta:
        fields = ['id', 'value', 'timestamp', 'color', 'default_unit', 'available_units']


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