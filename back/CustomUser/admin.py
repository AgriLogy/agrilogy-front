from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ['username', 'email', 'firstname', 'lastname', 'payement_status', 'user_type']
    list_filter = ['user_type', 'payement_status']
    search_fields = ['email', 'username']

admin.site.register(CustomUser, CustomUserAdmin)
