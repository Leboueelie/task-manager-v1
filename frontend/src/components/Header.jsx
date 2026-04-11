import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) return null

  // Récupère la première lettre du username
  const firstLetter = user?.username?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="navbar bg-base-100 shadow-lg mb-6">
      <div className="navbar-start">
        <span className="text-2xl">📋</span>
        <span className="text-xl font-bold ml-2">Rôc Lie</span>
      </div>
      
      <div className="navbar-end gap-2">
        <div className="flex items-center gap-3">
          {/* Avatar avec première lettre */}
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-lg font-bold">{firstLetter}</span>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium">{user?.username}</span>
            <span className="text-xs text-base-content/60">{user?.email}</span>
          </div>
        </div>
        
        <button onClick={logout} className="btn btn-ghost btn-sm gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </div>
  )
}

export default Header