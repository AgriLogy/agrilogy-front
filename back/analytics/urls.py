from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Create a router for viewsets
router = DefaultRouter()
router.register(r'sensors', SensorViewSet, basename='sensor')
router.register(r'alert', AlertViewSet, basename='alert')
urlpatterns = [
    # Include the router URLs for SensorViewSet
    # path('/ad/', include(router.urls)),
    
    # Additional API endpoints
	path('', include(router.urls)),
    path('notifications-and-alerts/', NotificationsAndAlertsView.as_view(), name='notifications-and-alerts'),
    path('all-sensor-data/', AllSensorDataView.as_view(), name='all-sensor-data'),
    path('header/', HeaderAPIView.as_view(), name='header'),
    path('graph-name/', GraphNameAPIView.as_view(), name='graph-name'),
    path('sensor-color/', SensorColorAPIView.as_view(), name='sensor-color'),
    # path('alert/', AlertsAPIView.as_view(), name='user-alert'),
    path('admin-user-data/', UserSensorDataView.as_view(), name='admin-user-data'),
    path('admin-header/', AdminHeaderAPIView.as_view(), name='admin-header'),
	path('/api/zones/', include(router.urls)
	
]
