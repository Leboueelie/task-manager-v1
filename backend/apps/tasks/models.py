from django.db import models


class Task(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Basse'),
        ('medium', 'Moyenne'),
        ('high', 'Haute'),
    ]
    
    STATUS_CHOICES = [
        ('todo', 'À faire'),
        ('done', 'Terminée'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='Titre')
    description = models.TextField(blank=True, verbose_name='Description')
    priority = models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium',
        verbose_name='Priorité'
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='todo',
        verbose_name='Statut'
    )
    due_date = models.DateField(null=True, blank=True, verbose_name='Date limite')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Tâche'
        verbose_name_plural = 'Tâches'
    
    def __str__(self):
        return self.title