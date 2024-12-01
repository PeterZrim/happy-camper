from django.urls import path
from .admin_views import dashboard

urlpatterns = [
    path('', dashboard, name='admin_dashboard'),
]
