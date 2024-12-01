from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CampsiteViewSet, CampsiteImageViewSet

router = DefaultRouter()
router.register(r'campsites', CampsiteViewSet)
router.register(r'campsites/(?P<campsite_pk>\d+)/images', CampsiteImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
