from rest_framework import viewsets, permissions, status, filters, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta
from .models import Booking, Review
from .serializers import BookingSerializer, ReviewSerializer
from .utils import check_availability, calculate_price
from campsites.permissions import IsBookingUserOrCampsiteOwner, CanReviewBooking

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
            
        if instance.check_in_date <= timezone.now().date():
            raise serializers.ValidationError({
                'non_field_errors': ['Cannot delete a booking that has started or completed.']
            })
            
        instance.delete()
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        # Validate cancellation
        if booking.status == 'cancelled':
            return Response(
                {'detail': 'Booking is already cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if booking.status == 'completed':
            return Response(
                {'detail': 'Cannot cancel a completed booking.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if booking.check_in_date <= timezone.now().date():
            return Response(
                {'detail': 'Cannot cancel a booking that has started.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'cancelled'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking (campsite owner or staff only)"""
        booking = self.get_object()
        
        if not (request.user == booking.campsite.owner or request.user.is_staff):
            return Response(
                {'detail': 'Only the campsite owner or staff can confirm bookings.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if booking.status != 'pending':
            return Response(
                {'detail': f'Cannot confirm a booking with status: {booking.status}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'confirmed'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark a booking as completed (automatic or staff only)"""
        booking = self.get_object()
        
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only staff members can manually complete bookings.'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        if booking.status != 'confirmed':
            return Response(
                {'detail': 'Only confirmed bookings can be completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if booking.check_out_date > timezone.now().date():
            return Response(
                {'detail': 'Cannot complete a booking before check-out date.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'completed'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, CanReviewBooking]
    
    def get_queryset(self):
        return Review.objects.filter(
            booking__user=self.request.user
        )
    
    def perform_create(self, serializer):
        booking = get_object_or_404(
            Booking,
            pk=self.kwargs.get('booking_pk'),
            user=self.request.user
        )
        
        # Validate that the booking is completed
        if booking.status != 'completed':
            raise serializers.ValidationError({
                'non_field_errors': ['Can only review completed bookings.']
            })
            
        # Check if review already exists
        if Review.objects.filter(booking=booking).exists():
            raise serializers.ValidationError({
                'non_field_errors': ['A review already exists for this booking.']
            })
            
        # Can only review within 30 days after check-out
        if booking.check_out_date < timezone.now().date() - timedelta(days=30):
            raise serializers.ValidationError({
                'non_field_errors': ['Reviews must be submitted within 30 days of check-out.']
            })
        
        serializer.save(booking=booking)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        
        # Can only update review within 7 days of creation
        if instance.created_at < timezone.now() - timedelta(days=7):
            raise serializers.ValidationError({
                'non_field_errors': ['Reviews can only be updated within 7 days of creation.']
            })
            
        serializer.save()
    
    def perform_destroy(self, instance):
        # Can only delete review within 7 days of creation
        if instance.created_at < timezone.now() - timedelta(days=7):
            raise serializers.ValidationError({
                'non_field_errors': ['Reviews can only be deleted within 7 days of creation.']
            })
            
        instance.delete()
