# from django.db.models import Q
from django.contrib.auth import get_user_model
# from django.views.decorators.csrf import csrf_exempt
# from django.utils.dateparse import parse_date, parse_datetime
# from django.utils.decorators import method_decorator
# from django.utils.timezone import now

from rest_framework import viewsets, status

# from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
# from rest_framework import status

from .models import *
from .serializers import *
from datetime import timedelta


from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils.dateparse import parse_datetime
from django.db.models import Q

class AllSensorDataView(APIView):
    def get(self, request):
        user = request.user
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        zone = request.query_params.get('zone')

        filter_kwargs = Q(user=user)

        if zone:
            filter_kwargs &= Q(zone_id=zone)
        if start_date:
            filter_kwargs &= Q(timestamp__gte=parse_datetime(start_date))
        if end_date:
            filter_kwargs &= Q(timestamp__lte=parse_datetime(end_date))

        # def get_data(model, serializer):
        #     queryset = model.objects.all()
        #     return serializer(queryset.first(), many=False).data if queryset.exists() else {}

        def get_data(model, serializer):
            queryset = model.objects.all()
            return serializer(queryset.first(), many=False).data if queryset.exists() else {}


        def get_latest_data(model, serializer):
            queryset = model.objects.filter(filter_kwargs).order_by('-timestamp')
            # return serializer(queryset.first()).data if queryset.exists() else {}
            return serializer(queryset, many=True).data if queryset.exists() else {}

        sensor_data = {
            "soil_moisture_low": get_latest_data(SoilMoistureLow, SoilMoistureLowSerializer),
            "soil_moisture_medium": get_latest_data(SoilMoistureMedium, SoilMoistureMediumSerializer),
            "soil_moisture_high": get_latest_data(SoilMoistureHigh, SoilMoistureHighSerializer),
            "soil_temperature_medium": get_latest_data(SoilTemperatureMedium, SoilTemperatureMediumSerializer),
            "ph_soil": get_latest_data(PhSoil, PhSoilSerializer),
            "ec_soil_medium": get_latest_data(ECSoilMedium, ECSoilMediumSerializer),
            # "PrecipitationRate": get_latest_data(PrecipitationRate, PrecipitationRateSerializer),
            # "HumidityWeather": get_latest_data(HumidityWeather, HumidityWeatherSerializer),
            # "WindSpeed": get_latest_data(WindSpeed, WindSpeedSerializer),
            # "SolarRadiation": get_latest_data(SolarRadiation, SolarRadiationSerializer),
            # "PressureWeather": get_latest_data(PressureWeather, PressureWeatherSerializer),
            # "WindDirection": get_latest_data(WindDirection, WindDirectionSerializer),
            # "TemperatureWeather": get_latest_data(TemperatureWeather, TemperatureWeatherSerializer),
            # "SoilECHigh": get_latest_data(SoilECHigh, SoilECHighSerializer),
            # "ECSoilLow": get_latest_data(ECSoilLow, ECSoilLowSerializer),
            # "SoilTemperatureLow": get_latest_data(SoilTemperatureLow, SoilTemperatureLowSerializer),
            # "SoilTemperatureHigh": get_latest_data(SoilTemperatureHigh, SoilTemperatureHighSerializer),
            # "WaterFlowSensor": get_latest_data(WaterFlowSensor, WaterFlowSensorSerializer),
            # "WaterECSensor": get_latest_data(WaterECSensor, WaterECSensorSerializer),
            # "PhWaterSensor": get_latest_data(PhWaterSensor, PhWaterSensorSerializer),
            # "ElectricityConsumptionSensor": get_latest_data(ElectricityConsumptionSensor, ElectricityConsumptionSensorSerializer),
            # "LeafMoistureSensor": get_latest_data(LeafMoistureSensor, LeafMoistureSensorSerializer),
            # "MultiDepthSoilMoistureSensor": get_latest_data(MultiDepthSoilMoistureSensor, MultiDepthSoilMoistureSensorSerializer),
            # "LargeFruitDiameterSensor": get_latest_data(LargeFruitDiameterSensor, LargeFruitDiameterSensorSerializer),
            # "WaterLevelSensor": get_latest_data(WaterLevelSensor, WaterLevelSensorSerializer),
            # "SoilSalinityConductivityIntegratedSensor": get_latest_data(SoilSalinityConductivityIntegratedSensor, SoilSalinityConductivityIntegratedSensorSerializer),
            # "NpkSensor": get_latest_data(NpkSensor, NpkSensorSerializer),
            # "FruitSizeSensor": get_latest_data(FruitSizeSensor, FruitSizeSensorSerializer),
            # "EcSalinitySensor": get_latest_data(EcSalinitySensor, EcSalinitySensorSerializer),
        }
        sensor_names = get_data(GraphName, GraphNameSerializer)
        sensor_colors = get_data(SensorColor, SensorColorSerializer)
        sensor_status = get_data(ActiveGraph, ActiveGraphSerializer)


        return Response({
            "sensor_data": sensor_data,
            "sensor_names" : sensor_names,
            "sensor_colors" : sensor_colors,
            "sensor_status" : sensor_status
            })



# User = get_user_model()

# class AllSensorDataView(APIView):
#     permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     start_date = request.query_params.get('start_date')
    #     end_date = request.query_params.get('end_date')
    #     zone = request.query_params.get('zone')

#         date_filter = Q()
#         if start_date and end_date:
#             try:
#                 start_date_parsed = parse_date(start_date)
#                 end_date_parsed = parse_date(end_date)

#                 if start_date_parsed and end_date_parsed:
#                     date_filter = Q(timestamp__range=[start_date_parsed, end_date_parsed])
#             except ValueError:
#                 return Response({"error": "Invalid date format"}, status=status.HTTP_400_BAD_REQUEST)

#         # Fetch and filter sensor data
#         user = request.user
#         queryset = Sensor.objects.filter(user=self.request.user) 
#         queryset = queryset.filter(date_filter)

#         try:
#             graph_name = GraphName.objects.get(user=request.user)
#             graph_name_serializer = GraphNameSerializer(graph_name)
#         except GraphName.DoesNotExist:
#             default_name = GraphName.objects.get(id=1)
#             graph_name_serializer = GraphNameSerializer(default_name)
#             # graph_name_serializer = None

#         try:
#             graph_color = SensorColor.objects.get(user=request.user)
#             graph_color_serializer = SensorColorSerializer(graph_color)
#         except SensorColor.DoesNotExist:
#             default_color = SensorColor.objects.get(id=1)
#             graph_color_serializer = SensorColorSerializer(default_color)

#         try:
#             graph_status_per_user, created = ActiveGraphPerUser.objects.get_or_create(
#                 user=request.user,
#                 defaults={'active_sensor': ActiveGraph.objects.create()}
#             )
#         except ActiveGraphPerUser.MultipleObjectsReturned:
#             # À gérer au cas où il y aurait un bug de base de données
#             graph_status_per_user = ActiveGraphPerUser.objects.filter(user=request.user).first()

#         graph_status_serializer = ActiveGraphPerUserSerializer(graph_status_per_user)

                
#         # Serialize the data
#         sensor_serializer = SensorSerializer(queryset, many=True)
#         return Response({
#             "sensor_data": sensor_serializer.data,
#             "sensor_names": graph_name_serializer.data if graph_name_serializer else None,
#             "sensor_colors": graph_color_serializer.data if graph_color_serializer else None,
#             "sensor_status": graph_status_serializer.data if graph_status_serializer else None,
#         }, status=status.HTTP_200_OK)

# class NotificationsAndAlertsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user

#         # Fetch user-specific notifications and alerts
#         user_notifications = NotificationsPerUser.objects.filter(user=user)

#         # Serialize the data
#         notifications_serializer = NotificationsPerUserSerializer(user_notifications, many=True)

#         return Response({
#             "notifications": notifications_serializer.data,
#         })

class HeaderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"username": user.username}, status=status.HTTP_200_OK)

# class GraphNameAPIView(APIView):
#     def get(self, request):
#         try:
#             graph_name = GraphName.objects.get(user_id= request.user.id)
#             serializer = GraphNameSerializer(graph_name)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except GraphName.DoesNotExist:
#             return Response({"error": "GraphName not found"}, status=status.HTTP_404_NOT_FOUND)

#     def put(self, request):
#         try:
#             graph_name = GraphName.objects.get(user_id= request.user.id)
#             serializer = GraphNameSerializer(graph_name, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except GraphName.DoesNotExist:
#             return Response({"error": "GraphName not found"}, status=status.HTTP_404_NOT_FOUND)

# class SensorColorAPIView(APIView):
#     def get(self, request):
#         try:
#             sensor_color = SensorColor.objects.get(user_id=request.user.id)
#             serializer = SensorColorSerializer(sensor_color)
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         except SensorColor.DoesNotExist:
#             return Response({"error": "SensorColor not found"}, status=status.HTTP_404_NOT_FOUND)

#     def put(self, request):
#         try:
#             sensor_color = SensorColor.objects.get(user_id=request.user.id)
#             serializer = SensorColorSerializer(sensor_color, data=request.data, partial=True)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_200_OK)
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#         except SensorColor.DoesNotExist:
#             return Response({"error": "SensorColor not found"}, status=status.HTTP_404_NOT_FOUND)
        
# class AlertsAPIView(APIView):
#     permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

#     def get(self, request):
#         alerts = Alert.objects.filter(user=request.user).order_by('-id')
#         serializer = AlertSerializer(alerts, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

#     def post(self, request):
#         # Manually add the user to the request data before validation
#         data = request.data.copy()  # Make a copy of the request data
#         data['user'] = request.user.id  # Assign the authenticated user's ID

#         # Pass the updated data to the serializer
#         serializer = AlertSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class AlertViewSet(viewsets.ModelViewSet):
#     serializer_class = AlertSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         # Filter alerts so users only access their own
#         return Alert.objects.filter(user=self.request.user).order_by('-id')

#     def perform_create(self, serializer):
#         # Automatically assign the logged-in user on create
#         serializer.save(user=self.request.user)

# class AuthZonePerUserAPIView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         """
#         List all Zones assigned to the authenticated user.
#         """
#         user = request.user
#         print(user)

#         assignments = ZonePerUser.objects.filter(user=user)
#         serializer = ZonePerUserSerializer(assignments, many=True)
        
#         return Response(serializer.data)

