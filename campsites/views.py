from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg
from .models import Campsite, CampsiteImage
from .serializers import CampsiteSerializer, CampsiteImageSerializer
from .permissions import IsCampsiteOwnerOrReadOnly
from .filters import CampsiteFilter

class CampsiteViewSet(viewsets.ModelViewSet):
    queryset = Campsite.objects.all()
    serializer_class = CampsiteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CampsiteFilter
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['price_per_night', 'created_at', 'total_spots', 'average_rating']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCampsiteOwnerOrReadOnly]
    
    def get_queryset(self):
        queryset = Campsite.objects.annotate(
            average_rating=Avg('reviews__rating')
        )
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        if min_price is not None:
            queryset = queryset.filter(price_per_night__gte=min_price)
        if max_price is not None:
            queryset = queryset.filter(price_per_night__lte=max_price)
            
        # Filter by amenities
        amenities = ['has_electricity', 'has_water', 'has_toilets', 'has_internet', 'has_store']
        for amenity in amenities:
            value = self.request.query_params.get(amenity, None)
            if value is not None:
                queryset = queryset.filter(**{amenity: value.lower() == 'true'})
                
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You don't have permission to update this campsite.")
        serializer.save()
        
    def perform_destroy(self, instance):
        if instance.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You don't have permission to delete this campsite.")
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get a list of featured campsites"""
        featured_campsites = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_campsites, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def images(self, request, pk=None):
        campsite = self.get_object()
        images = campsite.images.all()
        serializer = CampsiteImageSerializer(images, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def toggle_featured(self, request, pk=None):
        """Toggle featured status of a campsite (staff only)"""
        if not request.user.is_staff:
            return Response(
                {'detail': 'Only staff members can toggle featured status'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        campsite = self.get_object()
        campsite.is_featured = not campsite.is_featured
        campsite.save()
        
        serializer = self.get_serializer(campsite)
        return Response(serializer.data)
        
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Toggle active status of a campsite (owner or staff only)"""
        campsite = self.get_object()
        
        if campsite.owner != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'Only the owner or staff can toggle active status'},
                status=status.HTTP_403_FORBIDDEN
            )
            
        campsite.is_active = not campsite.is_active
        campsite.save()
        
        serializer = self.get_serializer(campsite)
        return Response(serializer.data)

class CampsiteImageViewSet(viewsets.ModelViewSet):
    queryset = CampsiteImage.objects.all()
    serializer_class = CampsiteImageSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCampsiteOwnerOrReadOnly]
    
    def get_queryset(self):
        return CampsiteImage.objects.filter(
            campsite_id=self.kwargs.get('campsite_pk')
        )
    
    def perform_create(self, serializer):
        from django.shortcuts import get_object_or_404
        campsite = get_object_or_404(Campsite, pk=self.kwargs.get('campsite_pk'))
        if campsite.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You do not have permission to add images to this campsite.")
        serializer.save(campsite=campsite)
        
    def perform_update(self, serializer):
        instance = self.get_object()
        if instance.campsite.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You don't have permission to update this image.")
        serializer.save()
        
    def perform_destroy(self, instance):
        if instance.campsite.owner != self.request.user and not self.request.user.is_staff:
            raise permissions.PermissionDenied("You don't have permission to delete this image.")
        instance.delete()
