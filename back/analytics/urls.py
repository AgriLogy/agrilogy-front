from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SensorViewSet,
    NotificationsAndAlertsView,
    AllSensorDataView,
    HeaderAPIView,
)

# Create a router for viewsets
router = DefaultRouter()
router.register(r'sensors', SensorViewSet, basename='sensor')

urlpatterns = [
    # Include the router URLs for SensorViewSet
    path('/', include(router.urls)),
    
    # Additional API endpoints
    path('notifications-and-alerts/', NotificationsAndAlertsView.as_view(), name='notifications-and-alerts'),
    path('all-sensor-data/', AllSensorDataView.as_view(), name='all-sensor-data'),
    path('header/', HeaderAPIView.as_view(), name='header'),
]
