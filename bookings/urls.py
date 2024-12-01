from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import BookingViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'bookings/(?P<booking_pk>\d+)/reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
]
