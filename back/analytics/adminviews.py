from django.db.models import Q
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date
from django.utils.decorators import method_decorator

from rest_framework import  status

from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

# from .models import ActiveGraph, ActiveGraphPerUser
from .models import *
from .serializers import *

from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


User = get_user_model()

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
        print(request.data)
        zone_data = request.data.copy()
        # zone_data.pop('user', None)  # <- this line is important atttttention

        serializer = ZoneSerializer(data=zone_data)

        if serializer.is_valid():
            zone = serializer.save(user=user)
            ZonePerUser.objects.create(user=user, zone=zone)
            return Response(
                ZonePerUserSerializer(ZonePerUser.objects.get(user=user, zone=zone)).data,
                status=status.HTTP_201_CREATED
            )
        else:
            print(serializer.errors)

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


class AdminHeaderAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        user = request.user
        return Response({"username": user.username}, status=status.HTTP_200_OK)

# class UserSensorDataView(APIView):
#     permission_classes = [IsAdminUser]  # Restrict access to admin users only

#     def post(self, request):
#         # Get user parameter from request
#         username = request.data.get('user')
#         start_date = request.data.get('start_date')
#         end_date = request.data.get('end_date')

#         # Validate user existence
#         try:
#             user = User.objects.get(username=username)
#         except User.DoesNotExist:
#             return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

#         # Create a date filter if start_date and end_date are provided
#         date_filter = Q()
#         if start_date and end_date:
#             try:
#                 start_date_parsed = parse_date(start_date)
#                 end_date_parsed = parse_date(end_date)

#                 if start_date_parsed and end_date_parsed:
#                     date_filter = Q(timestamp__range=[start_date_parsed, end_date_parsed])
#             except ValueError:
#                 return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

#         # Fetch and filter sensor data for the specified user
#         queryset = Sensor.objects.filter(user=user).filter(date_filter)

#         # Serialize the data
#         serializer = SensorSerializer(queryset, many=True)
#         return Response({"sensor_data": serializer.data}, status=status.HTTP_200_OK)



class ActiveGraphPerUserView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None

        # Try to get or create the link
        active_sensor_per_user, created = ActiveGraphPerUser.objects.get_or_create(
            user=user,
            defaults={'active_sensor': ActiveGraph.objects.create()}
        )
        return active_sensor_per_user.active_sensor

    def get(self, request, username):
        active_sensor = self.get_object(username)
        if not active_sensor:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ActiveGraphSerializer(active_sensor)
        return Response(serializer.data)

    def put(self, request, username):
        active_sensor = self.get_object(username)
        if not active_sensor:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = ActiveGraphSerializer(active_sensor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
