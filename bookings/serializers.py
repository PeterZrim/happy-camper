from rest_framework import serializers
from .models import Booking, Review

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'booking', 'rating', 'comment', 'created_at']
        read_only_fields = ['booking']

class BookingSerializer(serializers.ModelSerializer):
    review = ReviewSerializer(read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'campsite', 'check_in_date', 'check_out_date',
            'number_of_guests', 'status', 'total_price', 'created_at',
            'updated_at', 'review'
        ]
        read_only_fields = ['user', 'total_price', 'status']
        
    def validate(self, data):
        """
        Check that check_in_date is before check_out_date.
        """
        if data['check_in_date'] >= data['check_out_date']:
            raise serializers.ValidationError({
                'check_out_date': 'Check-out date must be after check-in date.'
            })
        return data
