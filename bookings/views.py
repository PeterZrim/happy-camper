from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Booking, Review
from .serializers import BookingSerializer, ReviewSerializer
from .utils import check_availability, calculate_price
from campsites.permissions import IsBookingUserOrCampsiteOwner, CanReviewBooking

# Create your views here.

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
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'confirmed':
            booking.status = 'cancelled'
            booking.save()
            return Response({'status': 'booking cancelled'})
        return Response(
            {'error': 'Cannot cancel booking'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        if booking.campsite.owner != request.user:
            return Response(
                {'error': 'Only campsite owners can confirm bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        if booking.status == 'pending':
            booking.status = 'confirmed'
            booking.save()
            return Response({'status': 'booking confirmed'})
        return Response(
            {'error': 'Cannot confirm booking'},
            status=status.HTTP_400_BAD_REQUEST
        )

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated, CanReviewBooking]
    
    def get_queryset(self):
        return Review.objects.filter(
            booking__user=self.request.user
        ) | Review.objects.filter(
            booking__campsite__owner=self.request.user
        )
    
    def perform_create(self, serializer):
        booking = get_object_or_404(
            Booking,
            pk=self.kwargs['booking_pk'],
            user=self.request.user
        )
        serializer.save(booking=booking)
