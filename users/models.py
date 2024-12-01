from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = [
        ('camper', 'Camper'),
        ('owner', 'Campsite Owner'),
    ]
    
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='camper')
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    
    # Additional fields for campsite owners
    business_name = models.CharField(max_length=200, blank=True)
    business_registration_number = models.CharField(max_length=50, blank=True)
    
    def __str__(self):
        return self.username
        
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
