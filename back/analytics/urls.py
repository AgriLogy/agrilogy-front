from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'phdata', PhDataViewSet, basename='phdata')
router.register(r'temperaturedata', TemperatureDataViewSet, basename='temperaturedata')
router.register(r'sensordata', SensorDataViewSet, basename='sensordata')
router.register(r'cumuldata', CumulDataViewSet, basename='cumuldata')
router.register(r'conductivitydata', ConductivityDataViewSet, basename='conductivitydata')
router.register(r'dashboard_sensor_data', DashboardSensorDataViewSet, basename='dashboarddata')
router.register(r'stationdata', StationDataViewSet, basename='stationdata')

urlpatterns = [
    path('', include(router.urls)),
    path('all-data/', AllDataView.as_view(), name='all-data'),
    path('header-data/', HeaderAPIView.as_view(), name='header-data'),
	path('notifications', UserNotificationsAndAlertsView.as_view(), name='user-notifications-alerts'),
]
