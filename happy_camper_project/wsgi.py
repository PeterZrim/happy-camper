"""
WSGI config for happy_camper_project project.
"""

import os
import sys
from pathlib import Path
from django.core.wsgi import get_wsgi_application

# Add the project directory to the sys.path
app_path = Path(__file__).resolve().parent.parent
sys.path.append(str(app_path))

# Set environment variable to use production settings
os.environ.setdefault('DJANGO_ENV', 'production')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'happy_camper_project.settings')

# Initialize WSGI application
application = get_wsgi_application()
