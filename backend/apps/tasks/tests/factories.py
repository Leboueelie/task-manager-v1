import factory
from django.contrib.auth.models import User
from apps.tasks.models import Task


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda obj: f"{obj.username}@test.com")
    password = factory.PostGenerationMethodCall('set_password', 'password123')


class TaskFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Task
    
    user = factory.SubFactory(UserFactory)
    title = factory.Faker('sentence', nb_words=4)
    description = factory.Faker('paragraph')
    priority = factory.Iterator(['low', 'medium', 'high'])
    status = 'todo'