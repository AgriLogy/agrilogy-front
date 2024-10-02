from django.contrib import admin
from .models import *

@admin.register(PhData)
class PhDataAdmin(admin.ModelAdmin):
    pass

@admin.register(TemperatureData)
class TemperatureDataAdmin(admin.ModelAdmin):
    pass

@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    pass

@admin.register(CumulData)
class CumulDataAdmin(admin.ModelAdmin):
    pass

@admin.register(ConductivityData)
class ConductivityDataAdmin(admin.ModelAdmin):
    pass

# @admin.register(Achievement)
# class AchievementAdmin(admin.ModelAdmin):
#     pass