import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message || 
                   'Une erreur est survenue'
    return Promise.reject(new Error(message))
  }
)

export const taskApi = {
  getAll: (params = {}) => api.get('/tasks/', { params }),
  getById: (id) => api.get(`/tasks/${id}/`),
  create: (data) => api.post('/tasks/', data),
  update: (id, data) => api.patch(`/tasks/${id}/`, data),
  delete: (id) => api.delete(`/tasks/${id}/`),
  toggleStatus: (id) => api.patch(`/tasks/${id}/toggle/`),
}