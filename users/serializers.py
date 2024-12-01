from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'password',
            'user_type',
            'phone_number',
            'address',
            'profile_picture',
            'business_name',
            'business_registration_number'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'business_name': {'required': False},
            'business_registration_number': {'required': False}
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            user_type=validated_data.get('user_type', 'camper'),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            business_name=validated_data.get('business_name', ''),
            business_registration_number=validated_data.get('business_registration_number', '')
        )
        return user

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            password = validated_data.pop('password')
            instance.set_password(password)
        return super().update(instance, validated_data)
