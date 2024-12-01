from datetime import datetime, timedelta
from django.db.models import Q
from .models import Booking

def check_availability(campsite, check_in_date, check_out_date):
    """
    Check if a campsite is available for the given date range.
    Returns True if available, False if not.
    """
    overlapping_bookings = Booking.objects.filter(
        campsite=campsite,
        status='confirmed',
        check_in_date__lt=check_out_date,
        check_out_date__gt=check_in_date
    ).count()
    
    return overlapping_bookings < campsite.total_spots

def get_available_dates(campsite, start_date, end_date):
    """
    Get a list of dates when the campsite is available within a given range.
    Returns a list of dates.
    """
    current_date = start_date
    available_dates = []
    
    while current_date <= end_date:
        if check_availability(campsite, current_date, current_date + timedelta(days=1)):
            available_dates.append(current_date)
        current_date += timedelta(days=1)
    
    return available_dates

def calculate_price(campsite, check_in_date, check_out_date):
    """
    Calculate the total price for a booking.
    """
    nights = (check_out_date - check_in_date).days
    return campsite.price_per_night * nights

def get_upcoming_bookings(user):
    """
    Get all upcoming bookings for a user.
    """
    today = datetime.now().date()
    return Booking.objects.filter(
        user=user,
        check_in_date__gte=today,
        status='confirmed'
    ).order_by('check_in_date')

def get_booking_conflicts(campsite, check_in_date, check_out_date):
    """
    Get any conflicting bookings for a given date range.
    """
    return Booking.objects.filter(
        campsite=campsite,
        status='confirmed',
        check_in_date__lt=check_out_date,
        check_out_date__gt=check_in_date
    )

def can_review_booking(booking):
    """
    Check if a booking can be reviewed.
    Returns True if the booking is completed and hasn't been reviewed yet.
    """
    today = datetime.now().date()
    return (
        booking.status == 'confirmed' and
        booking.check_out_date < today and
        not hasattr(booking, 'review')
    )
