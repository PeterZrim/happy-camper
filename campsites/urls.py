from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampsiteViewSet, CampsiteImageViewSet

router = DefaultRouter()
router.register(r'', CampsiteViewSet, basename='campsite')
router.register(r'(?P<campsite_pk>\d+)/images', CampsiteImageViewSet, basename='campsite-image')

urlpatterns = [
    path('', include(router.urls)),
]
