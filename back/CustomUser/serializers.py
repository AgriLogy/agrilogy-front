from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'firstname', 'lastname', 'phone_number', 'password', 'user_type']
    
    def create(self, validated_data):
        user = CustomUser(
            username=validated_data['username'],
            email=validated_data['email'],
            firstname=validated_data['firstname'],
            lastname=validated_data['lastname'],
            phone_number=validated_data['phone_number'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email',  'phone_number', 'payement_status', 'user_type' ]

class AdminModifyUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'firstname', 'lastname', 'phone_number', 'payement_status', 'user_type']

    def update(self, instance, validated_data):
        # Optionally, you could check if the user_type has changed and handle any other logic if necessary
        user_type = validated_data.get('user_type', instance.user_type)

        if user_type != instance.user_type:
            # Explicitly call the save method to update is_staff based on user_type
            instance.user_type = user_type

        return super().update(instance, validated_data)
