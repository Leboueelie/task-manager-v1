import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.tasks.tests.factories import UserFactory, TaskFactory


@pytest.mark.django_db
class TestAuthAPI:
    """Tests des endpoints d'authentification"""
    
    def test_register_success(self):
        """Test inscription réussie"""
        client = APIClient()
        data = {
            'username': 'newuser',
            'email': 'new@test.com',
            'password': 'password123',
            'password_confirm': 'password123'
        }
        
        response = client.post('/api/auth/register/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['user']['username'] == 'newuser'
    
    def test_register_password_mismatch(self):
        """Test inscription avec mots de passe différents"""
        client = APIClient()
        data = {
            'username': 'newuser',
            'email': 'new@test.com',
            'password': 'password123',
            'password_confirm': 'different'
        }
        
        response = client.post('/api/auth/register/', data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
    
    def test_login_success(self):
        """Test connexion réussie"""
        user = UserFactory()
        client = APIClient()
        
        response = client.post('/api/token/', {
            'username': user.username,
            'password': 'password123'
        })
        
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
    
    def test_login_invalid(self):
        """Test connexion échouée"""
        client = APIClient()
        
        response = client.post('/api/token/', {
            'username': 'wrong',
            'password': 'wrong'
        })
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestTaskAPI:
    """Tests des endpoints de tâches"""
    
    def test_list_tasks_authenticated(self):
        """Test liste des tâches (authentifié)"""
        user = UserFactory()
        TaskFactory.create_batch(3, user=user)
        
        client = APIClient()
        client.force_authenticate(user=user)
        
        response = client.get('/api/tasks/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
    
    def test_list_tasks_unauthenticated(self):
        """Test liste des tâches (non authentifié)"""
        client = APIClient()
        
        response = client.get('/api/tasks/')
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_task(self):
        """Test création d'une tâche"""
        user = UserFactory()
        client = APIClient()
        client.force_authenticate(user=user)
        
        data = {
            'title': 'Nouvelle tâche',
            'description': 'Description',
            'priority': 'high',
            'status': 'todo'
        }
        
        response = client.post('/api/tasks/', data)
        
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'Nouvelle tâche'
        assert response.data['user']['username'] == user.username
    
    def test_user_cannot_see_others_tasks(self):
        """Test qu'un utilisateur ne voit pas les tâches des autres"""
        user1 = UserFactory(username='user1')
        user2 = UserFactory(username='user2')
        
        TaskFactory(user=user1, title='Tâche user1')
        TaskFactory(user=user2, title='Tâche user2')
        
        client = APIClient()
        client.force_authenticate(user=user1)
        
        response = client.get('/api/tasks/')
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == 'Tâche user1'