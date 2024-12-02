from rest_framework import serializers
from .models import Campsite, CampsiteImage

class CampsiteImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampsiteImage
        fields = ['id', 'image', 'caption', 'is_primary', 'uploaded_at']
        read_only_fields = ['uploaded_at']

class CampsiteSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    images = CampsiteImageSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Campsite
        fields = [
            'id', 'owner', 'name', 'description', 'location', 'latitude', 'longitude',
            'price_per_night', 'has_electricity', 'has_water', 'has_toilets',
            'has_internet', 'has_store', 'total_spots', 'is_active', 'is_featured',
            'created_at', 'updated_at', 'images', 'average_rating'
        ]
        read_only_fields = ['created_at', 'updated_at', 'is_featured']
