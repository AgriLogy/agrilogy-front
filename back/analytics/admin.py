from django.contrib import admin
from .models import *

from django.contrib import admin
from .models import (
    Notification, Alert, Zone, KcPeriod, Kc, KcPeriodAssignment, Et0Calculated, Et0Weather,
    PrecipitationRate, HumidityWeather, WindSpeed, SolarRadiation, PressureWeather,
    WindDirection, TemperatureWeather, ECSoilMedium, ECSoilHigh, ECSoilLow,
    SoilMoistureMedium, SoilMoistureHigh, SoilMoistureLow, PhSoil,
    SoilTemperatureLow, SoilTemperatureMedium, SoilTemperatureHigh,
    WaterFlowSensor, WaterPressureSensor, WaterECSensor, PhWaterSensor,
    ElectricityConsumptionSensor, LeafMoistureSensor, LeafTemperatureSensor,
    MultiDepthSoilMoistureSensor, LargeFruitDiameterSensor, WaterLevelSensor,
    SoilSalinitySensor, SoilConductivitySensor, NpkSensor, FruitSizeSensor,
    EcSalinitySensor, SensorColor, SensorLocation, GraphName, ActiveGraph, VPDWeather
)

# Register all models at once
all_models = [
    Notification, Alert, Zone, KcPeriod, Kc, KcPeriodAssignment, Et0Calculated, Et0Weather,
    PrecipitationRate, HumidityWeather, WindSpeed, SolarRadiation, PressureWeather,
    WindDirection, TemperatureWeather, ECSoilMedium, ECSoilHigh, ECSoilLow,
    SoilMoistureMedium, SoilMoistureHigh, SoilMoistureLow, PhSoil,
    SoilTemperatureLow, SoilTemperatureMedium, SoilTemperatureHigh,
    WaterFlowSensor, WaterPressureSensor, WaterECSensor, PhWaterSensor,
    ElectricityConsumptionSensor, LeafMoistureSensor, LeafTemperatureSensor,
    MultiDepthSoilMoistureSensor, LargeFruitDiameterSensor, WaterLevelSensor,
    SoilSalinitySensor, SoilConductivitySensor, NpkSensor, FruitSizeSensor,
    EcSalinitySensor, SensorColor, SensorLocation, GraphName, ActiveGraph, VPDWeather
]

for model in all_models:
    admin.site.register(model)