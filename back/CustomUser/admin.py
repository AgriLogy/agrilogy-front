from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Explicitly define the fields that should appear in the admin panel
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('firstname', 'lastname', 'email', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Status', {'fields': ('payement_status', 'user_type')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'firstname', 'lastname', 'phone_number', 'payement_status', 'user_type'),
        }),
    )

    list_display = ('username', 'email', 'is_active', 'is_staff', 'user_type', 'payement_status')
    search_fields = ('username', 'email')
    ordering = ('username',)

# Register the custom user model and admin
admin.site.register(CustomUser, CustomUserAdmin)
