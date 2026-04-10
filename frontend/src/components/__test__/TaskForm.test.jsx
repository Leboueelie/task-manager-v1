import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TaskForm from '../TaskForm'

describe('TaskForm', () => {
  const mockSubmit = vi.fn()
  const mockCancel = vi.fn()

  it('renders create form', () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} isLoading={false} />)
    
    // Cherche par texte visible (DaisyUI modifie la structure)
    expect(screen.getByText(/nouvelle tâche/i)).toBeInTheDocument()
    // Cherche l'input par placeholder
    expect(screen.getByPlaceholderText(/nom de la tâche/i)).toBeInTheDocument()
  })

  it('shows validation error for empty title', async () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} isLoading={false} />)
    
    // Clique sur le bouton Créer
    const submitBtn = screen.getByRole('button', { name: /créer/i })
    fireEvent.click(submitBtn)
    
    await waitFor(() => {
      expect(screen.getByText(/titre est obligatoire/i)).toBeInTheDocument()
    })
  })

  it('calls onSubmit with form data', async () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} isLoading={false} />)
    
    // Remplit le titre
    const titleInput = screen.getByPlaceholderText(/nom de la tâche/i)
    fireEvent.change(titleInput, { target: { value: 'New Task' } })
    
    // Remplit la description
    const descInput = screen.getByPlaceholderText(/détails/i)
    fireEvent.change(descInput, { target: { value: 'Description' } })
    
    // Soumet
    fireEvent.click(screen.getByRole('button', { name: /créer/i }))
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Task',
        description: 'Description',
        priority: 'medium',
        status: 'todo'
      }))
    })
  })

  it('calls onCancel when cancel clicked', () => {
    render(<TaskForm onSubmit={mockSubmit} onCancel={mockCancel} isLoading={false} />)
    
    fireEvent.click(screen.getByRole('button', { name: /annuler/i }))
    expect(mockCancel).toHaveBeenCalled()
  })
})