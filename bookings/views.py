from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from .models import Booking
from .serializers import BookingSerializer
from .utils import check_availability, calculate_price
from campsites.permissions import IsBookingUserOrCampsiteOwner

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'campsite', 'check_in_date', 'check_out_date']
    ordering_fields = ['check_in_date', 'created_at', 'total_price']
    permission_classes = [permissions.IsAuthenticated, IsBookingUserOrCampsiteOwner]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(
            user=self.request.user
        ) | Booking.objects.filter(
            campsite__owner=self.request.user
        )
    
    def perform_create(self, serializer):
        campsite = serializer.validated_data['campsite']
        check_in = serializer.validated_data['check_in_date']
        check_out = serializer.validated_data['check_out_date']
        num_guests = serializer.validated_data['number_of_guests']
        
        # Validate dates
        if check_in < timezone.now().date():
            raise serializers.ValidationError({
                'check_in_date': ['Check-in date cannot be in the past.']
            })
            
        if (check_out - check_in).days > 14:
            raise serializers.ValidationError({
                'check_out_date': ['Maximum booking duration is 14 days.']
            })
            
        # Validate number of guests
        if num_guests > campsite.total_spots:
            raise serializers.ValidationError({
                'number_of_guests': [f'Maximum {campsite.total_spots} guests allowed for this campsite.']
            })
        
        # Check availability
        if not check_availability(campsite, check_in, check_out):
            raise serializers.ValidationError({
                'non_field_errors': ['This campsite is not available for the selected dates.']
            })
        
        # Calculate total price
        total_price = calculate_price(campsite, check_in, check_out)
        
        serializer.save(
            user=self.request.user,
            total_price=total_price,
            status='pending'
        )
    
    def perform_update(self, serializer):
        instance = self.get_object()
        
        # Only allow updates to certain fields based on status and user role
        if instance.status == 'cancelled':
            raise serializers.ValidationError({
                'non_field_errors': ['Cannot modify a cancelled booking.']
            })
            
        if instance.status == 'completed':
            raise serializers.ValidationError({
                'non_field_errors': ['Cannot modify a completed booking.']
            })
        
        # Recalculate price if dates changed
        if 'check_in_date' in serializer.validated_data or 'check_out_date' in serializer.validated_data:
            check_in = serializer.validated_data.get('check_in_date', instance.check_in_date)
            check_out = serializer.validated_data.get('check_out_date', instance.check_out_date)
            
            if not check_availability(instance.campsite, check_in, check_out, exclude_booking=instance):
                raise serializers.ValidationError({
                    'non_field_errors': ['Selected dates are not available.']
                })
                
            total_price = calculate_price(instance.campsite, check_in, check_out)
            serializer.save(total_price=total_price)
        else:
            serializer.save()
    
    def perform_destroy(self, instance):
        if instance.status not in ['pending', 'confirmed']:
            raise serializers.ValidationError({
                'non_field_errors': ['Can only delete pending or confirmed bookings.']
            })
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'cancelled':
            return Response(
                {'detail': 'Booking is already cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )
        booking.status = 'cancelled'
        booking.save()
        return Response({'detail': 'Booking cancelled successfully'})
