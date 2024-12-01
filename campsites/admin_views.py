from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.db.models import Count, Avg, Sum
from django.utils import timezone
from datetime import timedelta
from .models import Campsite
from bookings.models import Booking

@staff_member_required
def dashboard(request):
    # Get campsite owner's campsites
    campsites = Campsite.objects.filter(owner=request.user)
    
    # Get statistics for the last 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    # Bookings statistics
    recent_bookings = Booking.objects.filter(
        campsite__in=campsites,
        created_at__gte=thirty_days_ago
    )
    
    stats = {
        'total_campsites': campsites.count(),
        'total_spots': campsites.aggregate(Sum('total_spots'))['total_spots__sum'] or 0,
        'recent_bookings': recent_bookings.count(),
        'pending_bookings': recent_bookings.filter(status='pending').count(),
        'confirmed_bookings': recent_bookings.filter(status='confirmed').count(),
        'cancelled_bookings': recent_bookings.filter(status='cancelled').count(),
        'average_rating': recent_bookings.filter(review__isnull=False).aggregate(
            Avg('review__rating')
        )['review__rating__avg'] or 0,
        'total_revenue': recent_bookings.filter(status='confirmed').aggregate(
            Sum('total_price')
        )['total_price__sum'] or 0,
    }
    
    # Most popular campsites
    popular_campsites = campsites.annotate(
        booking_count=Count('booking')
    ).order_by('-booking_count')[:5]
    
    context = {
        'stats': stats,
        'popular_campsites': popular_campsites,
        'recent_bookings': recent_bookings.order_by('-created_at')[:10],
    }
    
    return render(request, 'admin/dashboard.html', context)
