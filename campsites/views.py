from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Campsite, CampsiteImage, Review
from .serializers import CampsiteSerializer, CampsiteImageSerializer, ReviewSerializer
from .permissions import IsCampsiteOwnerOrReadOnly
from .filters import CampsiteFilter

# Create your views here.

class CampsiteViewSet(viewsets.ModelViewSet):
    queryset = Campsite.objects.all()
    serializer_class = CampsiteSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = CampsiteFilter
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['price_per_night', 'created_at', 'total_spots', 'average_rating']
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCampsiteOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get a list of featured campsites"""
        featured_campsites = self.get_queryset().filter(is_featured=True)[:6]
        serializer = self.get_serializer(featured_campsites, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def review(self, request, pk=None):
        """Add a review to a campsite"""
        campsite = self.get_object()
        
        # Check if user has already reviewed this campsite
        if Review.objects.filter(campsite=campsite, user=request.user).exists():
            return Response(
                {'detail': 'You have already reviewed this campsite'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(campsite=campsite, user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """Get all reviews for a campsite"""
        campsite = self.get_object()
        reviews = campsite.reviews.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

class CampsiteImageViewSet(viewsets.ModelViewSet):
    queryset = CampsiteImage.objects.all()
    serializer_class = CampsiteImageSerializer
    permission_classes = [permissions.IsAuthenticated, IsCampsiteOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        campsite = Campsite.objects.get(pk=self.kwargs['campsite_pk'])
        if campsite.owner != self.request.user:
            raise permissions.PermissionDenied()
        serializer.save(campsite=campsite)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return Review.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
