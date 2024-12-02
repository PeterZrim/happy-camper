from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .models import Review
from .serializers import ReviewSerializer, ReviewDetailSerializer
from campsites.models import Campsite
from bookings.models import Booking

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        if self.action in ['retrieve', 'create', 'update', 'partial_update']:
            return ReviewDetailSerializer
        return ReviewSerializer
    
    def get_queryset(self):
        queryset = Review.objects.all()
        
        # Filter by review type
        review_type = self.request.query_params.get('type')
        if review_type:
            queryset = queryset.filter(review_type=review_type)
        
        # Filter by campsite
        campsite_id = self.request.query_params.get('campsite')
        if campsite_id:
            queryset = queryset.filter(campsite_id=campsite_id)
        
        # Filter by booking
        booking_id = self.request.query_params.get('booking')
        if booking_id:
            queryset = queryset.filter(booking_id=booking_id)
        
        # Filter by user
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        
        # Only show public reviews for non-owners
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_public=True)
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {
                        'status': 'error',
                        'message': 'Validation error',
                        'errors': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Additional validation
            review_type = request.data.get('review_type', 'campsite')
            if review_type == 'campsite':
                campsite_id = request.data.get('campsite')
                if not Campsite.objects.filter(id=campsite_id).exists():
                    return Response(
                        {
                            'status': 'error',
                            'message': 'Campsite not found',
                            'errors': {'campsite': ['Campsite does not exist']}
                        },
                        status=status.HTTP_404_NOT_FOUND
                    )
            else:
                booking_id = request.data.get('booking')
                if not Booking.objects.filter(id=booking_id).exists():
                    return Response(
                        {
                            'status': 'error',
                            'message': 'Booking not found',
                            'errors': {'booking': ['Booking does not exist']}
                        },
                        status=status.HTTP_404_NOT_FOUND
                    )
            
            review = serializer.save()
            return Response(
                {
                    'status': 'success',
                    'message': 'Review created successfully',
                    'data': ReviewDetailSerializer(review).data
                },
                status=status.HTTP_201_CREATED
            )
            
        except IntegrityError as e:
            return Response(
                {
                    'status': 'error',
                    'message': 'You have already reviewed this item',
                    'errors': {'non_field_errors': ['Duplicate review not allowed']}
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except ValidationError as e:
            return Response(
                {
                    'status': 'error',
                    'message': 'Validation error',
                    'errors': {'non_field_errors': e.messages}
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {
                    'status': 'error',
                    'message': 'An unexpected error occurred',
                    'errors': {'non_field_errors': [str(e)]}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def update(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Check if user owns the review
            if instance.user != request.user:
                return Response(
                    {
                        'status': 'error',
                        'message': 'Permission denied',
                        'errors': {'non_field_errors': ['You can only edit your own reviews']}
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(
                    {
                        'status': 'error',
                        'message': 'Validation error',
                        'errors': serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            review = serializer.save()
            return Response(
                {
                    'status': 'success',
                    'message': 'Review updated successfully',
                    'data': ReviewDetailSerializer(review).data
                }
            )
            
        except Exception as e:
            return Response(
                {
                    'status': 'error',
                    'message': 'An unexpected error occurred',
                    'errors': {'non_field_errors': [str(e)]}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            
            # Check if user owns the review
            if instance.user != request.user:
                return Response(
                    {
                        'status': 'error',
                        'message': 'Permission denied',
                        'errors': {'non_field_errors': ['You can only delete your own reviews']}
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            instance.delete()
            return Response(
                {
                    'status': 'success',
                    'message': 'Review deleted successfully'
                },
                status=status.HTTP_204_NO_CONTENT
            )
            
        except Exception as e:
            return Response(
                {
                    'status': 'error',
                    'message': 'An unexpected error occurred',
                    'errors': {'non_field_errors': [str(e)]}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=True, methods=['post'])
    def toggle_visibility(self, request, pk=None):
        try:
            review = self.get_object()
            
            # Check if user owns the review
            if review.user != request.user:
                return Response(
                    {
                        'status': 'error',
                        'message': 'Permission denied',
                        'errors': {'non_field_errors': ['You can only modify your own reviews']}
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            review.is_public = not review.is_public
            review.save()
            
            return Response(
                {
                    'status': 'success',
                    'message': f"Review is now {'public' if review.is_public else 'private'}",
                    'data': ReviewDetailSerializer(review).data
                }
            )
            
        except Exception as e:
            return Response(
                {
                    'status': 'error',
                    'message': 'An unexpected error occurred',
                    'errors': {'non_field_errors': [str(e)]}
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
