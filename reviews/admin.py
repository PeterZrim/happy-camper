from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'review_type', 'get_target', 'rating', 'is_public', 'created_at')
    list_filter = ('review_type', 'rating', 'is_public', 'created_at')
    search_fields = ('user__username', 'comment', 'campsite__name', 'booking__id')
    readonly_fields = ('created_at', 'updated_at')
    raw_id_fields = ('user', 'campsite', 'booking')

    def get_target(self, obj):
        if obj.review_type == 'campsite':
            return obj.campsite.name if obj.campsite else 'N/A'
        elif obj.review_type == 'booking':
            return f'Booking #{obj.booking.id}' if obj.booking else 'N/A'
        return 'N/A'
    get_target.short_description = 'Target'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related(
            'user', 'campsite', 'booking'
        )
