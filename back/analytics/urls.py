from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AllDataView, PhDataViewSet, TemperatureDataViewSet, SensorDataViewSet, CumulDataViewSet, ConductivityDataViewSet

router = DefaultRouter()
router.register(r'phdata', PhDataViewSet)
router.register(r'temperaturedata', TemperatureDataViewSet)
router.register(r'sensordata', SensorDataViewSet)
router.register(r'cumuldata', CumulDataViewSet)
router.register(r'conductivitydata', ConductivityDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('all-data/', AllDataView.as_view(), name='all-data'),
]
