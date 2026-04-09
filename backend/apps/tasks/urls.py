# backend/apps/tasks/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, register, me

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    # Auth endpoints
    path('auth/register/', register, name='register'),
    path('auth/me/', me, name='me'),
]