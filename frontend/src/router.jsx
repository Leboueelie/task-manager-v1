import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TaskList from './components/TaskList'

// Route protégée : redirige vers login si non authentifié
function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <div>Chargement...</div>
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

// Route publique : redirige vers tasks si déjà authentifié
function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) return <div>Chargement...</div>
  
  return !isAuthenticated ? children : <Navigate to="/" />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <TaskList />
      </PrivateRoute>
    ),
  },
])