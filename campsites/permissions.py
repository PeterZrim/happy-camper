from rest_framework import permissions

class IsCampsiteOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a campsite to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Write permissions are only allowed to the owner
        return obj.owner == request.user

class IsBookingUserOrCampsiteOwner(permissions.BasePermission):
    """
    Custom permission to only allow booking users or campsite owners to view booking details.
    """
    def has_object_permission(self, request, view, obj):
        # Allow access if user made the booking or owns the campsite
        return obj.user == request.user or obj.campsite.owner == request.user

class CanReviewBooking(permissions.BasePermission):
    """
    Custom permission to only allow users to review their completed bookings.
    """
    def has_permission(self, request, view):
        if request.method != 'POST':
            return True
            
        booking_id = view.kwargs.get('booking_pk')
        if not booking_id:
            return False
            
        from bookings.models import Booking
        from bookings.utils import can_review_booking
        
        try:
            booking = Booking.objects.get(pk=booking_id, user=request.user)
            return can_review_booking(booking)
        except Booking.DoesNotExist:
            return False
