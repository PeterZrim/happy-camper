"""
Script to collect static files for production deployment.
"""

import os
import subprocess
from pathlib import Path

def collect_static():
    # Set environment variables
    os.environ['DJANGO_ENV'] = 'production'
    os.environ['DJANGO_SETTINGS_MODULE'] = 'happy_camper_project.settings'
    
    # Create static root directory if it doesn't exist
    static_root = Path(__file__).resolve().parent.parent / 'staticfiles'
    static_root.mkdir(exist_ok=True)
    
    # Run collectstatic command
    try:
        subprocess.run(['python', 'manage.py', 'collectstatic', '--noinput'], check=True)
        print("Successfully collected static files")
    except subprocess.CalledProcessError as e:
        print(f"Error collecting static files: {e}")
        raise

if __name__ == '__main__':
    collect_static()
