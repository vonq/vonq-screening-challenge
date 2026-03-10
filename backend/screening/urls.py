from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"employers", views.EmployerViewSet, basename="employer")
router.register(r"jobs", views.JobViewSet, basename="job")
router.register(r"candidates", views.CandidateViewSet, basename="candidate")
router.register(r"applications", views.ApplicationViewSet, basename="application")

urlpatterns = [
    path("", include(router.urls)),
]
