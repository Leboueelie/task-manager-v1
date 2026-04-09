import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur de requête : ajoute le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponse : gère les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer le 401 (non autorisé)
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Rediriger vers login (on fera ça proprement avec PrivateRoute après)
      window.location.href = '/login'
    }
    
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