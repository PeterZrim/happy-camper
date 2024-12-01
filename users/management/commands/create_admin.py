from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Creates a superuser with predefined credentials'

    def handle(self, *args, **options):
        if not CustomUser.objects.filter(username='admin').exists():
            CustomUser.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                user_type='owner'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
