from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    campsite_name = serializers.ReadOnlyField(source='campsite.name')
    
    class Meta:
        model = Booking
        fields = [
            'id', 'user', 'campsite', 'campsite_name', 'check_in_date',
            'check_out_date', 'number_of_guests', 'status', 'total_price',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'total_price', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Check that check_in_date is before check_out_date.
        """
        if data['check_in_date'] >= data['check_out_date']:
            raise serializers.ValidationError({
                'check_out_date': 'Check-out date must be after check-in date.'
            })
        return data
