import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../AuthContext'

// Composant de test
function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'connected' : 'disconnected'}</div>
      {user && <div data-testid="username">{user.username}</div>}
      <button onClick={() => login('token123', { username: 'testuser' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts unauthenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('auth-status')).toHaveTextContent('disconnected')
  })

  it('login sets user and token', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    fireEvent.click(screen.getByText('Login'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('connected')
      expect(screen.getByTestId('username')).toHaveTextContent('testuser')
    })
  })

  it('logout clears user and token', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    // Login first
    fireEvent.click(screen.getByText('Login'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('connected')
    })
    
    // Then logout
    fireEvent.click(screen.getByText('Logout'))
    
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('disconnected')
    })
  })
})