import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { useTasks } from '../useTasks'

const mockTasks = [
  { id: 1, title: 'Task 1', status: 'todo', priority: 'high', user: { username: 'test' } },
  { id: 2, title: 'Task 2', status: 'done', priority: 'low', user: { username: 'test' } },
]

const server = setupServer(
  http.get('http://localhost:8000/api/tasks/', () => {
    return HttpResponse.json(mockTasks)
  })
)

beforeAll(() => server.listen())
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  
  return function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
  }
}

describe('useTasks', () => {
  it('fetches tasks successfully', async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper()
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toHaveLength(2)
    expect(result.current.data[0].title).toBe('Task 1')
  })

  it('shows loading state initially', () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper()
    })

    expect(result.current.isLoading).toBe(true)
  })
})