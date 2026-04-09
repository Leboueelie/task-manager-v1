import { api } from './api'

export const authApi = {
  login: (credentials) => api.post('/token/', credentials),
  register: (data) => api.post('/auth/register/', data),
  me: () => api.get('/auth/me/'),
}