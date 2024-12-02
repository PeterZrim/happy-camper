from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'content_type', 'object_id', 'rating', 'is_visible', 'created_at')
    list_filter = ('content_type', 'rating', 'is_visible', 'created_at')
    search_fields = ('user__username', 'comment')
    readonly_fields = ('created_at',)
    raw_id_fields = ('user',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'content_type')
