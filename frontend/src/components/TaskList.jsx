// frontend/src/components/TaskList.jsx
import { useState } from 'react'
import { 
  useTasks, 
  useDeleteTask, 
  useToggleTaskStatus,
  useCreateTask,
  useUpdateTask 
} from '../hooks/useTasks'
import { useToast } from '../hooks/useToast'
import Header from './Header'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'
import Toast from './Toast'
import ConfirmModal from './ConfirmModal'

function TaskList() {
  const [filter, setFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  
  const { toast, showToast, hideToast } = useToast()
  
  const filters = filter !== 'all' ? { status: filter } : {}
  const { data: tasks, isLoading, error } = useTasks(filters)
  
  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()
  const toggleMutation = useToggleTaskStatus()

  const handleCreate = () => {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  const handleEdit = (task) => {
    const formattedTask = {
      ...task,
      due_date: task.due_date ? task.due_date : ''
    }
    setEditingTask(formattedTask)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  const handleSubmit = (data) => {
    const cleanData = {
      ...data,
      due_date: data.due_date || null,
    }

    if (editingTask) {
      updateMutation.mutate(
        { id: editingTask.id, data: cleanData },
        { 
          onSuccess: () => {
            showToast('Tâche modifiée avec succès !')
            handleCloseForm()
          },
          onError: (err) => showToast(err.message, 'error')
        }
      )
    } else {
      createMutation.mutate(cleanData, { 
        onSuccess: () => {
          showToast('Tâche créée avec succès !')
          handleCloseForm()
        },
        onError: (err) => showToast(err.message, 'error')
      })
    }
  }

  const handleDeleteClick = (id) => {
    setDeleteId(id)
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        showToast('Tâche supprimée !')
        setDeleteId(null)
      },
      onError: (err) => {
        showToast(err.message, 'error')
        setDeleteId(null)
      }
    })
  }

  const handleToggle = (id) => {
    toggleMutation.mutate(id, {
      onSuccess: () => {
        showToast('Statut mis à jour !', 'info')
      },
      onError: (err) => showToast(err.message, 'error')
    })
  }

  const isFormLoading = createMutation.isPending || updateMutation.isPending

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="text-base-content/60">Chargement des tâches...</p>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="alert alert-error max-w-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Erreur: {error.message}</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-200 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <Header />
        
        {toast && (
          <div className="fixed top-4 right-4 z-50">
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={hideToast} 
            />
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Mes Tâches</h2>
          
          <div className="flex gap-2">
            <select 
              className="select select-bordered select-sm"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Toutes</option>
              <option value="todo">À faire</option>
              <option value="done">Terminées</option>
            </select>
            
            <button onClick={handleCreate} className="btn btn-primary btn-sm gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nouvelle tâche
            </button>
          </div>
        </div>

        {/* Modal Formulaire */}
        {isFormOpen && (
          <div className="modal modal-open">
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              isLoading={isFormLoading}
            />
          </div>
        )}

        {/* Modal Confirmation */}
        {deleteId && (
          <ConfirmModal
            title="Confirmer la suppression"
            message="Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette tâche ?"
            onConfirm={handleConfirmDelete}
            onCancel={() => setDeleteId(null)}
            isLoading={deleteMutation.isPending}
          />
        )}

        {/* Liste des tâches */}
        {tasks?.length === 0 ? (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body items-center text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Aucune tâche</h3>
              <p className="text-base-content/70 mb-6">Commencez par créer votre première tâche</p>
              <button onClick={handleCreate} className="btn btn-primary gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer une tâche
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks?.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDeleteClick}
                onToggle={handleToggle}
                onEdit={handleEdit}
                isDeleting={deleteMutation.isPending && deleteId === task.id}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        {tasks?.length > 0 && (
          <div className="stats shadow mt-8 w-full bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="stat-title">Total</div>
              <div className="stat-value text-primary">{tasks.length}</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-warning">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-title">À faire</div>
              <div className="stat-value text-warning">{tasks.filter(t => t.status === 'todo').length}</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="stat-title">Terminées</div>
              <div className="stat-value text-success">{tasks.filter(t => t.status === 'done').length}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskList