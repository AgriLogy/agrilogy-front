from rest_framework import viewsets
from .models import PhData, TemperatureData, SensorData, CumulData, ConductivityData
from .serializers import PhDataSerializer, TemperatureDataSerializer, SensorDataSerializer, CumulDataSerializer, ConductivityDataSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

class PhDataViewSet(viewsets.ModelViewSet):
    queryset = PhData.objects.all()
    serializer_class = PhDataSerializer


class TemperatureDataViewSet(viewsets.ModelViewSet):
    queryset = TemperatureData.objects.all()
    serializer_class = TemperatureDataSerializer


class SensorDataViewSet(viewsets.ModelViewSet):
    queryset = SensorData.objects.all()
    serializer_class = SensorDataSerializer


class CumulDataViewSet(viewsets.ModelViewSet):
    queryset = CumulData.objects.all()
    serializer_class = CumulDataSerializer


class ConductivityDataViewSet(viewsets.ModelViewSet):
    queryset = ConductivityData.objects.all()
    serializer_class = ConductivityDataSerializer
    

class AllDataView(APIView):
    def get(self, request, *args, **kwargs):
        ph_data = PhData.objects.all()
        temperature_data = TemperatureData.objects.all()
        sensor_data = SensorData.objects.all()
        cumul_data = CumulData.objects.all()
        conductivity_data = ConductivityData.objects.all()

        data = {
            "ph_data": PhDataSerializer(ph_data, many=True).data,
            "temperature_data": TemperatureDataSerializer(temperature_data, many=True).data,
            "sensor_data": SensorDataSerializer(sensor_data, many=True).data,
            "cumul_data": CumulDataSerializer(cumul_data, many=True).data,
            "conductivity_data": ConductivityDataSerializer(conductivity_data, many=True).data,
        }

        return Response(data)
