from rest_framework import serializers
from .models import Review
from users.serializers import CustomUserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'review_type',
            'campsite',
            'booking',
            'rating',
            'comment',
            'cleanliness_rating',
            'location_rating',
            'value_rating',
            'average_rating',
            'created_at',
            'updated_at',
            'is_public',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def validate(self, data):
        # Validate review type and related object
        review_type = data.get('review_type', 'campsite')
        campsite = data.get('campsite')
        booking = data.get('booking')
        
        if review_type == 'campsite':
            if not campsite:
                raise serializers.ValidationError({
                    'campsite': 'Campsite is required for campsite reviews'
                })
            if booking:
                raise serializers.ValidationError({
                    'booking': 'Booking should not be set for campsite reviews'
                })
        elif review_type == 'booking':
            if not booking:
                raise serializers.ValidationError({
                    'booking': 'Booking is required for booking reviews'
                })
            if campsite:
                raise serializers.ValidationError({
                    'campsite': 'Campsite should not be set for booking reviews'
                })
        
        return data
    
    def create(self, validated_data):
        # Set the user from the request
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class ReviewDetailSerializer(ReviewSerializer):
    """Detailed serializer for individual review endpoints"""
    class Meta(ReviewSerializer.Meta):
        fields = ReviewSerializer.Meta.fields + [
            'is_public',
        ]
