import os
import sys
import django
import random

# Add the project root to the Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'happy_camper_project.settings')
django.setup()

from campsites.models import Campsite

def set_featured_campsites():
    """Set some random campsites as featured"""
    # Get all active campsites
    active_campsites = Campsite.objects.filter(is_active=True)
    
    if not active_campsites.exists():
        print("No active campsites found")
        return
    
    # Reset all featured flags
    Campsite.objects.all().update(is_featured=False)
    
    # Select up to 6 random campsites to feature
    num_to_feature = min(6, active_campsites.count())
    featured_campsites = random.sample(list(active_campsites), num_to_feature)
    
    # Set them as featured
    for campsite in featured_campsites:
        campsite.is_featured = True
        campsite.save()
        print(f"Set {campsite.name} as featured")

if __name__ == '__main__':
    set_featured_campsites()
