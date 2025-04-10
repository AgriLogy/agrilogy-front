from django.db.models import Q
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date, parse_datetime
from django.utils.decorators import method_decorator
from django.utils.timezone import now

from rest_framework import viewsets, status

from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import *
from .serializers import *
from datetime import timedelta


User = get_user_model()


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
        else:
            # Default: Filter only last month's data
            last_month = now() - timedelta(days=30)
            queryset = queryset.filter(timestamp__gte=last_month)

        return queryset
    
    def create(self, request, *args, **kwargs):
        """
        Create a new Sensor record.
        If authenticated, assign the user; if not, leave user null (or handle as needed).
        """
        data = request.data.copy()

        # Optional: If the user is authenticated, attach them.
        if request.user.is_authenticated:
            data['user'] = request.user.id
        else:
            data['user'] = None  # or remove this line if 'user' isn't required

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        
    def delete_all(self, request, *args, **kwargs):
        """
        Delete all sensor data for the authenticated user.
        Supports optional filtering by start_date and end_date.
        """
        queryset = Sensor.objects.filter(user=request.user)

        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if start_date and end_date:
            try:
                start_date_parsed = parse_date(start_date)
                end_date_parsed = parse_date(end_date)

                if start_date_parsed and end_date_parsed:
                    queryset = queryset.filter(
                        timestamp__range=[start_date_parsed, end_date_parsed]
                    )
                else:
                    return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)
            except ValueError:
                return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

        deleted_count, _ = queryset.delete()
        return Response({"message": f"Deleted {deleted_count} sensor records."}, status=status.HTTP_200_OK)


class NotificationsAndAlertsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Fetch user-specific notifications and alerts
        user_notifications = NotificationsPerUser.objects.filter(user=user)

        # Serialize the data
        notifications_serializer = NotificationsPerUserSerializer(user_notifications, many=True)

        return Response({
            "notifications": notifications_serializer.data,
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
        user = request.user
        queryset = Sensor.objects.filter(user=self.request.user) 
        queryset = queryset.filter(date_filter)

        try:
            graph_name = GraphName.objects.get(user=request.user)
            graph_name_serializer = GraphNameSerializer(graph_name)
        except GraphName.DoesNotExist:
            default_name = GraphName.objects.get(id=1)
            graph_name_serializer = GraphNameSerializer(default_name)
            # graph_name_serializer = None

        try:
            graph_color = SensorColor.objects.get(user=request.user)
            graph_color_serializer = SensorColorSerializer(graph_color)
        except SensorColor.DoesNotExist:
            default_color = SensorColor.objects.get(id=1)
            graph_color_serializer = SensorColorSerializer(default_color)
            # graph_color_serializer = None

        # Serialize the data
        sensor_serializer = SensorSerializer(queryset, many=True)
        return Response({
            "sensor_data": sensor_serializer.data,
            "sensor_names": graph_name_serializer.data if graph_name_serializer else None,
            "sensor_colors": graph_color_serializer.data if graph_color_serializer else None,
        }, status=status.HTTP_200_OK)

class HeaderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"username": user.username}, status=status.HTTP_200_OK)

class AdminHeaderAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        user = request.user
        return Response({"username": user.username}, status=status.HTTP_200_OK)



User = get_user_model()

class UserSensorDataView(APIView):
    permission_classes = [IsAdminUser]  # Restrict access to admin users only

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




class GraphNameAPIView(APIView):
    def get(self, request):
        try:
            graph_name = GraphName.objects.get(user_id= request.user.id)
            serializer = GraphNameSerializer(graph_name)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GraphName.DoesNotExist:
            return Response({"error": "GraphName not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            graph_name = GraphName.objects.get(user_id= request.user.id)
            serializer = GraphNameSerializer(graph_name, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except GraphName.DoesNotExist:
            return Response({"error": "GraphName not found"}, status=status.HTTP_404_NOT_FOUND)

class SensorColorAPIView(APIView):
    def get(self, request):
        try:
            sensor_color = SensorColor.objects.get(user_id=request.user.id)
            serializer = SensorColorSerializer(sensor_color)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SensorColor.DoesNotExist:
            return Response({"error": "SensorColor not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request):
        try:
            sensor_color = SensorColor.objects.get(user_id=request.user.id)
            serializer = SensorColorSerializer(sensor_color, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except SensorColor.DoesNotExist:
            return Response({"error": "SensorColor not found"}, status=status.HTTP_404_NOT_FOUND)
        
class AlertsAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        alerts = Alert.objects.filter(user=request.user).order_by('-id')
        serializer = AlertSerializer(alerts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        # Manually add the user to the request data before validation
        data = request.data.copy()  # Make a copy of the request data
        data['user'] = request.user.id  # Assign the authenticated user's ID

        # Pass the updated data to the serializer
        serializer = AlertSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter alerts so users only access their own
        return Alert.objects.filter(user=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        # Automatically assign the logged-in user on create
        serializer.save(user=self.request.user)

class AuthZonePerUserAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        List all Zones assigned to the authenticated user.
        """
        user = request.user
        print(user)

        assignments = ZonePerUser.objects.filter(user=user)
        serializer = ZonePerUserSerializer(assignments, many=True)
        
        return Response(serializer.data)


class ZonePerUserAPIView(APIView):
    # authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    """
    Manage Zones for a specific User.
    """
    def get(self, request, username):
        """
        List all Zones assigned to the user.
        """
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        assignments = ZonePerUser.objects.filter(user=user)
        serializer = ZonePerUserSerializer(assignments, many=True)
        return Response(serializer.data)

    def post(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Remove user from incoming data if it exists
        zone_data = request.data.copy()
        zone_data.pop('user', None)  # <- this line is important atttttention

        serializer = ZoneSerializer(data=zone_data)

        if serializer.is_valid():
            zone = serializer.save(user=user)
            ZonePerUser.objects.create(user=user, zone=zone)
            return Response(
                ZonePerUserSerializer(ZonePerUser.objects.get(user=user, zone=zone)).data,
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class ModZonePerUserAPIView(APIView):
    def put(self, request, username, zone_id):
        """
        Modify one of the user's Zones (update Zone fields).
        """
        try:
            user = User.objects.get(username=username)
            zone = Zone.objects.get(id=zone_id, zoneperuser__user=user)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Zone.DoesNotExist:
            return Response({'detail': 'Zone not found or not assigned to this user'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ZoneSerializer(zone, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, username, zone_id):
        """
        Delete a specific Zone from the user's assigned Zones.
        """
        try:
            user = User.objects.get(username=username)
            zone = Zone.objects.get(id=zone_id, zoneperuser__user=user)
        except User.DoesNotExist:
            return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Zone.DoesNotExist:
            return Response({'detail': 'Zone not found or not assigned to this user'}, status=status.HTTP_404_NOT_FOUND)

        # Remove the assignment
        ZonePerUser.objects.filter(user=user, zone=zone).delete()
        # Optionally delete the zone itself
        zone.delete()

        return Response({'detail': 'Zone deleted'}, status=status.HTTP_204_NO_CONTENT)
