from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from campsites.models import Campsite
from bookings.models import Booking

class Review(models.Model):
    REVIEW_TYPE_CHOICES = [
        ('campsite', 'Campsite Review'),
        ('booking', 'Booking Review'),
    ]
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='unified_reviews',
        on_delete=models.CASCADE
    )
    
    # Optional relations - only one should be set based on review_type
    campsite = models.ForeignKey(
        Campsite,
        related_name='unified_reviews',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    booking = models.ForeignKey(
        Booking,
        related_name='reviews',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    
    review_type = models.CharField(
        max_length=10,
        choices=REVIEW_TYPE_CHOICES,
        default='campsite'
    )
    
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    
    # Additional fields for comprehensive reviews
    cleanliness_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    location_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    value_rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        null=True,
        blank=True
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_public = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        constraints = [
            # Ensure only one relation is set based on review_type
            models.CheckConstraint(
                check=(
                    models.Q(review_type='campsite', booking__isnull=True, campsite__isnull=False) |
                    models.Q(review_type='booking', booking__isnull=False, campsite__isnull=True)
                ),
                name='valid_review_type_relation'
            ),
            # One review per user per campsite/booking
            models.UniqueConstraint(
                fields=['user', 'campsite'],
                condition=models.Q(review_type='campsite'),
                name='unique_user_campsite_review'
            ),
            models.UniqueConstraint(
                fields=['user', 'booking'],
                condition=models.Q(review_type='booking'),
                name='unique_user_booking_review'
            )
        ]
    
    def clean(self):
        from django.core.exceptions import ValidationError
        
        if self.review_type == 'campsite' and not self.campsite:
            raise ValidationError('Campsite review must have a campsite')
        elif self.review_type == 'booking' and not self.booking:
            raise ValidationError('Booking review must have a booking')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    @property
    def average_rating(self):
        ratings = [self.rating]
        if self.cleanliness_rating:
            ratings.append(self.cleanliness_rating)
        if self.location_rating:
            ratings.append(self.location_rating)
        if self.value_rating:
            ratings.append(self.value_rating)
        return sum(ratings) / len(ratings)
    
    def __str__(self):
        if self.review_type == 'campsite':
            return f"{self.user.username}'s review of {self.campsite.name}"
        return f"{self.user.username}'s review of booking {self.booking.id}"
