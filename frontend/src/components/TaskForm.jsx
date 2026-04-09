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
      reset(defaultTaskValues)
    }
  }

  return (
    <div className="modal-box max-w-lg">
      <h3 className="font-bold text-lg mb-4">
        {task ? '✏️ Modifier la tâche' : '➕ Nouvelle tâche'}
      </h3>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Titre *</span>
          </label>
          <input
            type="text"
            placeholder="Nom de la tâche"
            className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
            {...register('title')}
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.title.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Description</span>
          </label>
          <textarea
            placeholder="Détails de la tâche (optionnel)"
            className={`textarea textarea-bordered w-full h-24 ${errors.description ? 'textarea-error' : ''}`}
            {...register('description')}
          />
          {errors.description && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.description.message}</span>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Priorité *</span>
            </label>
            <select className="select select-bordered w-full" {...register('priority')}>
              <option value="low">🟢 Basse</option>
              <option value="medium">🟡 Moyenne</option>
              <option value="high">🔴 Haute</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Statut *</span>
            </label>
            <select className="select select-bordered w-full" {...register('status')}>
              <option value="todo">⏳ À faire</option>
              <option value="done">✅ Terminée</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Date limite</span>
            </label>
            <input 
              type="date" 
              className="input input-bordered w-full"
              {...register('due_date')} 
            />
          </div>
        </div>

        <div className="modal-action pt-4">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Enregistrement...' : task ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm