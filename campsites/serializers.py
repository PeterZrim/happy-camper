from rest_framework import serializers
from .models import Campsite, CampsiteImage, Review

class CampsiteImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampsiteImage
        fields = ['id', 'image', 'caption', 'is_primary', 'uploaded_at']

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'user_name', 'rating', 'comment', 'created_at']
        read_only_fields = ['user']
    
    def get_user_name(self, obj):
        return obj.user.username

class CampsiteSerializer(serializers.ModelSerializer):
    images = CampsiteImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Campsite
        fields = [
            'id', 'name', 'description', 'location', 'latitude', 'longitude',
            'price_per_night', 'has_electricity', 'has_water', 'has_toilets',
            'has_internet', 'has_store', 'total_spots', 'created_at',
            'updated_at', 'is_active', 'images', 'image_url', 'is_featured',
            'reviews', 'average_rating'
        ]
    
    def get_image_url(self, obj):
        """Get the URL of the primary image, or the first image if no primary image exists"""
        primary_image = obj.images.filter(is_primary=True).first()
        if primary_image:
            return primary_image.image.url if primary_image.image else None
        
        # If no primary image, get the first image
        first_image = obj.images.first()
        return first_image.image.url if first_image and first_image.image else None
