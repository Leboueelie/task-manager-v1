from rest_framework import viewsets, status
from rest_framework.decorators import action , api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated , AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from .models import Task
from .serializers import TaskSerializer, RegisterSerializer, UserSerializer
from django.contrib.auth.models import User


@api_view(['POST'])
@permission_classes([AllowAny])  # Pas besoin d'être connecté pour s'inscrire
def register(request):
    """Inscription d'un nouvel utilisateur"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'message': 'Utilisateur créé avec succès',
            'user': UserSerializer(user).data
        }, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Doit être connecté
def me(request):
    """Infos de l'utilisateur connecté"""
    return Response(UserSerializer(request.user).data)

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'priority']
    ordering_fields = ['due_date', 'priority', 'created_at']
    
    def get_queryset(self):
        """Ne retourne que les tâches de l'utilisateur connecté"""
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Crée la tâche avec l'utilisateur courant"""
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        """Basculer le statut"""
        task = self.get_object()
        task.toggle_status()
        serializer = self.get_serializer(task)
        return Response(serializer.data)