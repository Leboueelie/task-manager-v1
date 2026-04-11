// frontend/src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authApi } from '../services/auth'
import { api } from '../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await authApi.login(credentials)
      const { access } = response.data
      
      localStorage.setItem('token', access)
      
      const meResponse = await api.get('/auth/me/', {
        headers: { Authorization: `Bearer ${access}` }
      })
      
      login(access, meResponse.data)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Identifiants incorrects')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">🔐 Connexion</h1>
            <p className="text-base-content/70 mt-2">Bienvenue sur Rôc Lie votre gestionaire de tâche</p>
          </div>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nom d'utilisateur</span>
              </label>
              <input
                type="text"
                placeholder="Votre nom d'utilisateur"
                className="input input-bordered w-full"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mot de passe</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          
          <div className="divider">OU</div>
          
          <div className="text-center">
            <p className="text-sm text-base-content/70">
              Pas encore de compte ?{' '}
              <Link to="/register" className="link link-primary font-medium">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage