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
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Chargement des tâches...</p>
    </div>
  )
  
  if (error) return <div className="error">Erreur: {error.message}</div>

  return (
    <div className="task-list-container">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}

      <div className="task-list-header">
        <h1>Task Manager V1</h1>
        <div className="filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Toutes les tâches</option>
            <option value="todo">À faire</option>
            <option value="done">Terminées</option>
          </select>
          <button onClick={handleCreate} className="btn-primary">
            + Nouvelle Tâche
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <TaskForm
              task={editingTask}
              onSubmit={handleSubmit}
              onCancel={handleCloseForm}
              isLoading={isFormLoading}
            />
          </div>
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Confirmer la suppression"
          message="Cette action est irréversible. Êtes-vous sûr ?"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteId(null)}
          isLoading={deleteMutation.isPending}
        />
      )}

      <div className="tasks-grid">
        {tasks?.length === 0 ? (
          <div className="empty-state">
            <p>Aucune tâche pour le moment</p>
            <button onClick={handleCreate} className="btn-primary">
              Créer votre première tâche
            </button>
          </div>
        ) : (
          tasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={handleDeleteClick}
              onToggle={handleToggle}
              onEdit={handleEdit}
              isDeleting={deleteMutation.isPending && deleteId === task.id}
              isToggling={toggleMutation.isPending}
            />
          ))
        )}
      </div>

      {tasks?.length > 0 && (
        <div className="stats">
          <span className="stat-item">
            <strong>{tasks.length}</strong> Total
          </span>
          <span className="stat-item">
            <strong>{tasks.filter(t => t.status === 'todo').length}</strong> À faire
          </span>
          <span className="stat-item">
            <strong>{tasks.filter(t => t.status === 'done').length}</strong> Terminées
          </span>
        </div>
      )}
    </div>
  )
}

export default TaskList