from django.contrib import admin
from .models import Campsite, CampsiteImage

class CampsiteImageInline(admin.TabularInline):
    model = CampsiteImage
    extra = 1

@admin.register(Campsite)
class CampsiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'price_per_night', 'is_featured', 'owner')
    list_filter = ('is_featured', 'location')
    search_fields = ('name', 'description', 'location')
    inlines = [CampsiteImageInline]
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(owner=request.user)

@admin.register(CampsiteImage)
class CampsiteImageAdmin(admin.ModelAdmin):
    list_display = ('campsite', 'image', 'is_primary')
    list_filter = ('is_primary',)
    search_fields = ('campsite__name',)
