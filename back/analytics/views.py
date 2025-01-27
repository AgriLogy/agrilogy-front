from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils.dateparse import parse_date, parse_datetime
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import *
from .serializers import *
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Sensor
from .serializers import SensorSerializer
from django.utils.dateparse import parse_date

class SensorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SensorSerializer

    def get_queryset(self):
        queryset = Sensor.objects.filter(user=self.request.user) 

        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date and end_date:
            try:
                start_date_parsed = parse_date(start_date)
                end_date_parsed = parse_date(end_date)

                if start_date_parsed and end_date_parsed:
                    queryset = queryset.filter(
                        timestamp__range=[start_date_parsed, end_date_parsed]
                    )
                else:
                    raise ValueError("Invalid date format")
            except ValueError:
                return queryset.none()

        return queryset


class NotificationsAndAlertsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Fetch user-specific notifications and alerts
        user_notifications = NotificationsPerUser.objects.filter(user=user)
        user_alerts = AlertsPerUser.objects.filter(user=user)

        # Serialize the data
        notifications_serializer = NotificationsPerUserSerializer(user_notifications, many=True)
        alerts_serializer = AlertsPerUserSerializer(user_alerts, many=True)

        return Response({
            "notifications": notifications_serializer.data,
            "alerts": alerts_serializer.data
        })

class AllSensorDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        date_filter = Q()
        if start_date and end_date:
            try:
                start_date_parsed = parse_date(start_date)
                end_date_parsed = parse_date(end_date)

                if start_date_parsed and end_date_parsed:
                    date_filter = Q(timestamp__range=[start_date_parsed, end_date_parsed])
            except ValueError:
                return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch and filter sensor data
        queryset = Sensor.objects.filter(user=self.request.user) 
        queryset = queryset.filter(date_filter)

        # Serialize the data
        serializer = SensorSerializer(queryset, many=True)
        return Response({"sensor_data": serializer.data})

class HeaderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"username": user.username}, status=status.HTTP_200_OK)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import status
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.utils.dateparse import parse_date

from .models import Sensor
from .serializers import SensorSerializer

User = get_user_model()

class UserSensorDataView(APIView):
    # permission_classes = [IsAdminUser]  # Restrict access to admin users only
    permission_classes = [AllowAny]  # Restrict access to admin users only

    def post(self, request):
        # Get user parameter from request
        username = request.data.get('user')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # Validate user existence
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create a date filter if start_date and end_date are provided
        date_filter = Q()
        if start_date and end_date:
            try:
                start_date_parsed = parse_date(start_date)
                end_date_parsed = parse_date(end_date)

                if start_date_parsed and end_date_parsed:
                    date_filter = Q(timestamp__range=[start_date_parsed, end_date_parsed])
            except ValueError:
                return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch and filter sensor data for the specified user
        queryset = Sensor.objects.filter(user=user).filter(date_filter)

        # Serialize the data
        serializer = SensorSerializer(queryset, many=True)
        return Response({"sensor_data": serializer.data}, status=status.HTTP_200_OK)