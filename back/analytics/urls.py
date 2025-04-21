from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .adminviews import *

# Create a router for viewsets
router = DefaultRouter()
# router.register(r'sensors', SensorViewSet, basename='sensor')
router.register(r'alert', AlertViewSet, basename='alert')
urlpatterns = [
    # Auth user urls
	path('', include(router.urls)),
    path('notifications-and-alerts/', NotificationsAndAlertsView.as_view(), name='notifications-and-alerts'),
    path('all-sensor-data/', AllSensorDataView.as_view(), name='all-sensor-data'),
    path('header/', HeaderAPIView.as_view(), name='header'),
    path('graph-name/', GraphNameAPIView.as_view(), name='graph-name'),
    path('sensor-color/', SensorColorAPIView.as_view(), name='sensor-color'),
	path('auth-zone-per-user/', csrf_exempt(AuthZonePerUserAPIView.as_view()), name='zone-per-user'),
    # path('alert/', AlertsAPIView.as_view(), name='user-alert'),
	
    # Admin urls
    path('admin-user-data/', UserSensorDataView.as_view(), name='admin-user-data'),
    path('admin-header/', AdminHeaderAPIView.as_view(), name='admin-header'),
	path('zone-per-user/<str:username>/', csrf_exempt(ZonePerUserAPIView.as_view()), name='zone-per-user'),
    path('mod-zone-per-user/<str:username>/<int:zone_id>/', ModZonePerUserAPIView.as_view(), name='zone-per-user'),
    path('sensor-activation/<str:username>/', ActiveGraphPerUserView.as_view(), name='sensor-activation-admin'),
    #zone urls : user
	
]
