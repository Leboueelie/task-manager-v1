from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import Task
from .serializers import TaskSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'priority']
    ordering_fields = ['due_date', 'priority', 'created_at']
    
    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        """Endpoint PATCH /api/tasks/{id}/toggle/ pour basculer le statut"""
        task = self.get_object()
        task.toggle_status()
        serializer = self.get_serializer(task)
        return Response(serializer.data)