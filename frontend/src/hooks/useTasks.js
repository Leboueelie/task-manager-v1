import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskApi } from '../services/api'

const TASKS_KEY = 'tasks'

// Hook pour récupérer toutes les tâches
export const useTasks = (filters = {}) => {
  return useQuery({
    queryKey: [TASKS_KEY, filters],
    queryFn: () => taskApi.getAll(filters).then(res => res.data),
  })
}

// Hook pour créer une tâche
export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

// Hook pour supprimer une tâche
export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => taskApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

// Hook pour toggle le statut
export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => taskApi.toggleStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
    },
  })
}

// Hook pour modifier une tâche
export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => taskApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY] })
      queryClient.invalidateQueries({ queryKey: [TASKS_KEY, variables.id] })
    },
  })
}