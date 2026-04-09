// frontend/src/components/TaskItem.jsx
const priorityColors = {
  low: 'badge-info',
  medium: 'badge-warning',
  high: 'badge-error',
}

const priorityLabels = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
}

function TaskItem({ task, onDelete, onToggle, onEdit, isDeleting }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const isOverdue = task.due_date && 
    new Date(task.due_date) < new Date() && 
    task.status === 'todo'

  return (
    <div className={`card bg-base-100 shadow-md hover:shadow-lg transition-shadow ${task.status === 'done' ? 'opacity-60' : ''}`}>
      <div className="card-body p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={task.status === 'done'}
              onChange={() => onToggle(task.id)}
            />
            <h3 className={`card-title text-lg ${task.status === 'done' ? 'line-through text-base-content/50' : ''}`}>
              {task.title}
            </h3>
          </div>
          <div className={`badge ${priorityColors[task.priority]} badge-md`}>
            {priorityLabels[task.priority]}
          </div>
        </div>

        {task.description && (
          <p className="text-base-content/70 text-sm mt-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-base-content/60 mt-3">
          <span className={isOverdue ? 'text-error font-semibold' : ''}>
            📅 {formatDate(task.due_date)}
            {isOverdue && ' (En retard)'}
          </span>
          <span>
            🕐 {new Date(task.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>

        <div className="card-actions justify-end mt-4 pt-3 border-t border-base-200">
          <button 
            onClick={() => onEdit(task)} 
            className="btn btn-ghost btn-sm"
            disabled={isDeleting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </button>
          <button 
            onClick={() => onDelete(task.id)} 
            className={`btn btn-ghost btn-sm text-error hover:bg-error hover:text-error-content ${isDeleting ? 'loading' : ''}`}
            disabled={isDeleting}
          >
            {!isDeleting && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskItem