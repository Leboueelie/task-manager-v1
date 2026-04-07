const priorityLabels = {
  low: { label: 'Basse', class: 'priority-low' },
  medium: { label: 'Moyenne', class: 'priority-medium' },
  high: { label: 'Haute', class: 'priority-high' },
}

function TaskItem({ task, onDelete, onToggle, onEdit, isDeleting, isToggling }) {
  const priority = priorityLabels[task.priority]
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const isOverdue = task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status === 'todo'

  return (
    <div className={`task-item ${task.status === 'done' ? 'task-done' : ''}`}>
      <div className="task-header">
        <input
          type="checkbox"
          checked={task.status === 'done'}
          onChange={() => !isToggling && onToggle(task.id)}
          className="task-checkbox"
          disabled={isToggling}
        />
        {isToggling && <span className="spinner-small">⟳</span>}
        <h3 className="task-title">{task.title}</h3>
        <span className={`priority-badge ${priority.class}`}>
          {priority.label}
        </span>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={isOverdue ? 'overdue' : ''}>
          {formatDate(task.due_date)}
          {isOverdue && ' (En retard !)'}
        </span>
        <span> {new Date(task.created_at).toLocaleDateString('fr-FR')}</span>
      </div>

      <div className="task-actions">
        <button 
          onClick={() => onEdit(task)} 
          className="btn-edit"
          disabled={isDeleting}
        >
          Modifier
        </button>
        <button 
          onClick={() => onDelete(task.id)} 
          className="btn-delete"
          disabled={isDeleting}
        >
          {isDeleting ? '...' : ' Supprimer'}
        </button>
      </div>
    </div>
  )
}

export default TaskItem