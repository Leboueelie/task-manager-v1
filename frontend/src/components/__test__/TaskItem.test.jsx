import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import TaskItem from '../TaskItem'

describe('TaskItem', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    priority: 'high',
    status: 'todo',
    due_date: '2026-04-15',
    created_at: '2026-04-10T10:00:00Z',
  }

  const mockHandlers = {
    onDelete: vi.fn(),
    onToggle: vi.fn(),
    onEdit: vi.fn(),
  }

  it('renders task title', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />)
    expect(screen.getByText('Haute')).toBeInTheDocument()
  })

  it('calls onToggle when checkbox clicked', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />)
    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)
    expect(mockHandlers.onToggle).toHaveBeenCalledWith(1)
  })

  it('calls onDelete when delete button clicked', () => {
    render(<TaskItem task={mockTask} {...mockHandlers} />)
    const deleteBtn = screen.getByText('Supprimer')
    fireEvent.click(deleteBtn)
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(1)
  })
})