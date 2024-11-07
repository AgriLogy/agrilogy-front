from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from django.utils.dateparse import parse_date
from django.db.models import Q

from .serializers import *
from .models import *

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
    



class DashboardSensorDataViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = DashboardSensorData.objects.all()
    serializer_class = DashboardSensorDataSerializer


class AllDataView(APIView):
    permission_classes = [IsAuthenticated]
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


from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from django.utils.dateparse import parse_datetime
from django.shortcuts import get_object_or_404
from .models import StationData
from .serializers import StationDataSerializer

class StationDataViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    """
    A ViewSet for viewing and editing StationData entries.
    It accepts `start_date` and `end_date` query params to filter by timestamp.
    """
    queryset = StationData.objects.all().order_by('-timestamp')
    serializer_class = StationDataSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date and end_date:
            try:
                # Parse the start and end dates
                start_date_parsed = parse_datetime(start_date)
                end_date_parsed = parse_datetime(end_date)

                if start_date_parsed and end_date_parsed:
                    # Filter the queryset based on the date range
                    queryset = queryset.filter(
                        timestamp__range=[start_date_parsed, end_date_parsed]
                    )
                else:
                    raise ValueError("Invalid date format")
            except ValueError:
                # You can add error handling for invalid date formats
                return queryset.none()  # Return no results if the dates are invalid
        
        return queryset

class HeaderAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({"username" : user.username}, status=status.HTTP_200_OK)
    
class UserNotificationsAndAlertsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Fetch notifications and alerts for the authenticated user
        user_notifications = NotificationsPerUser.objects.filter(user=user)
        user_alerts = AlertsPerUser.objects.filter(user=user)

        # Serialize the data
        notifications_serializer = NotificationsPerUserSerializer(user_notifications, many=True)
        alerts_serializer = AlertsPerUserSerializer(user_alerts, many=True)

        # Combine and return the response
        return Response({
            "notifications": notifications_serializer.data,
            "alerts": alerts_serializer.data
        })
