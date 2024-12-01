from django.contrib import admin
from .models import Booking, Review

# Register your models here.

class ReviewInline(admin.StackedInline):
    model = Review
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'campsite', 'check_in_date', 'check_out_date', 'number_of_guests', 'status', 'total_price')
    list_filter = ('status', 'check_in_date', 'check_out_date')
    search_fields = ('user__username', 'campsite__name')
    ordering = ('-check_in_date',)
    date_hierarchy = 'check_in_date'
    readonly_fields = ('total_price', 'created_at', 'updated_at')
    inlines = [ReviewInline]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(campsite__owner=request.user)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('booking', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('booking__user__username', 'booking__campsite__name', 'comment')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
