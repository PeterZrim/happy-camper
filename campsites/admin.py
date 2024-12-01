from django.contrib import admin
from .models import Campsite, CampsiteImage

@admin.register(Campsite)
class CampsiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'location', 'price_per_night', 'total_spots', 'is_active')
    list_filter = ('is_active', 'has_electricity', 'has_water', 'has_toilets', 'has_internet', 'has_store')
    search_fields = ('name', 'location', 'description')
    ordering = ('name',)

@admin.register(CampsiteImage)
class CampsiteImageAdmin(admin.ModelAdmin):
    list_display = ('campsite', 'caption', 'is_primary', 'uploaded_at')
    list_filter = ('is_primary', 'uploaded_at')
    search_fields = ('campsite__name', 'caption')
    ordering = ('-uploaded_at',)
