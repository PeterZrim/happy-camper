import django_filters
from django.db.models import Avg
from .models import Campsite
from django.db.models import Q

class CampsiteFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name='price_per_night', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price_per_night', lookup_expr='lte')
    min_rating = django_filters.NumberFilter(method='filter_by_rating')
    search = django_filters.CharFilter(method='filter_by_search')
    
    class Meta:
        model = Campsite
        fields = {
            'has_electricity': ['exact'],
            'has_water': ['exact'],
            'has_toilets': ['exact'],
            'has_internet': ['exact'],
            'has_store': ['exact'],
            'is_active': ['exact'],
        }
    
    def filter_by_rating(self, queryset, name, value):
        """Filter campsites by minimum average rating"""
        if value is not None:
            return queryset.annotate(
                avg_rating=Avg('reviews__rating')
            ).filter(avg_rating__gte=value)
        return queryset
    
    def filter_by_search(self, queryset, name, value):
        """Search in name, description, and location"""
        if value:
            return queryset.filter(
                Q(name__icontains=value) |
                Q(description__icontains=value) |
                Q(location__icontains=value)
            )
        return queryset
