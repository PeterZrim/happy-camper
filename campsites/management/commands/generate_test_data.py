from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from campsites.models import Campsite
from bookings.models import Booking, Review
import random
from datetime import timedelta

User = get_user_model()

class Command(BaseCommand):
    help = 'Generate test data for Happy Camper application'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating test users...')
        
        # Create superuser if it doesn't exist
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write('Created superuser: admin/admin123')
        
        # Create campsite owners
        owners = []
        for i in range(3):
            username = f'owner{i+1}'
            if not User.objects.filter(username=username).exists():
                owner = User.objects.create_user(
                    username=username,
                    email=f'owner{i+1}@example.com',
                    password='owner123',
                    user_type='owner',
                    business_name=f'Camping Business {i+1}'
                )
                owners.append(owner)
                self.stdout.write(f'Created campsite owner: {username}/owner123')
            else:
                owners.append(User.objects.get(username=username))
        
        # Create regular users
        users = []
        for i in range(5):
            username = f'user{i+1}'
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(
                    username=username,
                    email=f'user{i+1}@example.com',
                    password='user123',
                    user_type='camper'
                )
                users.append(user)
                self.stdout.write(f'Created user: {username}/user123')
            else:
                users.append(User.objects.get(username=username))
        
        # Create campsites
        self.stdout.write('Creating campsites...')
        locations = [
            'Mountain View', 'Lakeside', 'Forest Grove',
            'Beach Front', 'Desert Oasis', 'River Bend'
        ]
        
        for i in range(10):
            name = f'Camp {locations[i % len(locations)]}'
            if not Campsite.objects.filter(name=name).exists():
                campsite = Campsite.objects.create(
                    owner=random.choice(owners),
                    name=name,
                    description=f'A beautiful campsite at {name}',
                    location=locations[i % len(locations)],
                    latitude=random.uniform(25.0, 48.0),
                    longitude=random.uniform(-125.0, -70.0),
                    price_per_night=random.randint(20, 100),
                    has_electricity=random.choice([True, False]),
                    has_water=random.choice([True, False]),
                    has_toilets=random.choice([True, False]),
                    has_internet=random.choice([True, False]),
                    has_store=random.choice([True, False]),
                    total_spots=random.randint(5, 20),
                    is_active=True
                )
                self.stdout.write(f'Created campsite: {name}')
        
        # Create bookings and reviews
        self.stdout.write('Creating bookings and reviews...')
        campsites = Campsite.objects.all()
        
        for _ in range(20):
            user = random.choice(users)
            campsite = random.choice(campsites)
            start_date = timezone.now().date() + timedelta(days=random.randint(-30, 60))
            
            booking = Booking.objects.create(
                user=user,
                campsite=campsite,
                check_in_date=start_date,
                check_out_date=start_date + timedelta(days=random.randint(1, 7)),
                number_of_guests=random.randint(1, 4),
                status=random.choice(['pending', 'confirmed', 'cancelled', 'completed']),
                total_price=random.randint(50, 500)
            )
            
            # Add reviews for completed bookings
            if booking.status == 'completed':
                Review.objects.create(
                    booking=booking,
                    rating=random.randint(1, 5),
                    comment=f'This was a {"great" if random.random() > 0.2 else "okay"} camping experience!'
                )
        
        self.stdout.write(self.style.SUCCESS('Successfully generated test data'))
