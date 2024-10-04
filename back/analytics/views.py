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
    

from rest_framework import viewsets
from .models import PhData, TemperatureData, SensorData, CumulData, ConductivityData
from .serializers import PhDataSerializer, TemperatureDataSerializer, SensorDataSerializer, CumulDataSerializer, ConductivityDataSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.dateparse import parse_date
from django.db.models import Q

class AllDataView(APIView):
    def get(self, request, *args, **kwargs):
        # Get 'start_date' and 'end_date' from query parameters
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        # Convert start and end dates to actual date objects if provided
        if start_date:
            start_date = parse_date(start_date)
        if end_date:
            end_date = parse_date(end_date)

        # Filter data based on date range if both dates are provided
        date_filter = Q()
        if start_date and end_date:
            date_filter = Q(timestamp__range=[start_date, end_date])

        # Fetch and filter each dataset
        ph_data = PhData.objects.filter(date_filter)
        temperature_data = TemperatureData.objects.filter(date_filter)
        sensor_data = SensorData.objects.filter(date_filter)
        cumul_data = CumulData.objects.filter(date_filter)
        conductivity_data = ConductivityData.objects.filter(date_filter)

        # Serialize the filtered data
        data = {
            "ph_data": PhDataSerializer(ph_data, many=True).data,
            "temperature_data": TemperatureDataSerializer(temperature_data, many=True).data,
            "sensor_data": SensorDataSerializer(sensor_data, many=True).data,
            "cumul_data": CumulDataSerializer(cumul_data, many=True).data,
            "conductivity_data": ConductivityDataSerializer(conductivity_data, many=True).data,
        }

        return Response(data)

