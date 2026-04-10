import pytest
from django.contrib.auth.models import User
from apps.tasks.models import Task


@pytest.mark.django_db
class TestTaskModel:
    """Tests du modèle Task"""
    
    def test_create_task(self):
        """Test création basique d'une tâche"""
        user = User.objects.create_user('testuser', 'test@test.com', 'password123')
        task = Task.objects.create(
            user=user,
            title="Ma tâche test",
            description="Description test",
            priority="high",
            status="todo"
        )
        
        assert task.title == "Ma tâche test"
        assert task.user == user
        assert task.priority == "high"
        assert task.status == "todo"
        assert str(task) == "Ma tâche test (testuser)"
    
    def test_toggle_status(self):
        """Test du basculement de statut"""
        user = User.objects.create_user('testuser', 'test@test.com', 'password123')
        task = Task.objects.create(user=user, title="Tâche", status="todo")
        
        assert task.status == "todo"
        task.toggle_status()
        assert task.status == "done"
        task.toggle_status()
        assert task.status == "todo"
    
    def test_task_ordering(self):
        """Test que les tâches sont ordonnées par date de création décroissante"""
        user = User.objects.create_user('testuser', 'test@test.com', 'password123')
        
        task1 = Task.objects.create(user=user, title="Ancienne")
        task2 = Task.objects.create(user=user, title="Récente")
        
        tasks = list(Task.objects.all())
        assert tasks[0] == task2  # La plus récente d'abord
        assert tasks[1] == task1