import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taskSchema, defaultTaskValues } from '../schemas/taskSchema'

function TaskForm({ task, onSubmit, onCancel, isLoading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: task || defaultTaskValues,
  })

  const handleFormSubmit = (data) => {
    onSubmit(data)
    if (!task) {
      reset(defaultTaskValues) // Reset si création
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="task-form">
      <h2>{task ? 'Modifier la tâche' : 'Nouvelle tâche'}</h2>
      
      <div className="form-group">
        <label htmlFor="title">Titre *</label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className={errors.title ? 'error' : ''}
          placeholder="Nom de la tâche"
        />
        {errors.title && (
          <span className="error-message">{errors.title.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          placeholder="Détails de la tâche (optionnel)"
        />
        {errors.description && (
          <span className="error-message">{errors.description.message}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priorité *</label>
          <select id="priority" {...register('priority')}>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Statut *</label>
          <select id="status" {...register('status')}>
            <option value="todo">À faire</option>
            <option value="done">Terminée</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Date limite</label>
          <input 
            type="date" 
            id="due_date" 
            {...register('due_date')} 
          />
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          onClick={onCancel} 
          className="btn-secondary"
          disabled={isLoading}
        >
          Annuler
        </button>
        <button 
          type="submit" 
          disabled={isLoading} 
          className="btn-primary"
        >
          {isLoading ? 'Enregistrement...' : task ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  )
}

export default TaskForm