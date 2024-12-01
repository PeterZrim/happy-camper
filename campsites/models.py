from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Campsite(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='owned_campsites', null=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Amenities
    has_electricity = models.BooleanField(default=False)
    has_water = models.BooleanField(default=False)
    has_toilets = models.BooleanField(default=False)
    has_internet = models.BooleanField(default=False)
    has_store = models.BooleanField(default=False)
    
    # Capacity
    total_spots = models.PositiveIntegerField()
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    
    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if not reviews:
            return None
        return sum(review.rating for review in reviews) / len(reviews)
    
    def __str__(self):
        return self.name
        
class CampsiteImage(models.Model):
    campsite = models.ForeignKey(Campsite, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='campsite_images/')
    caption = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.campsite.name}"

class Review(models.Model):
    campsite = models.ForeignKey(Campsite, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['campsite', 'user']  # One review per user per campsite
    
    def __str__(self):
        return f"{self.user.username}'s review of {self.campsite.name}"
