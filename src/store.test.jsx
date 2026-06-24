import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnecdotes, useAnecdoteActions, useAnecdoteStoreRaw } from './store'
import * as anecdoteService from './services/anecdotes'

vi.mock('./services/anecdotes', () => ({
  getAll: vi.fn(),
  createNew: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))

beforeEach(() => {
  useAnecdoteStoreRaw.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

describe('6.12 – initialisation from backend', () => {
  it('initializes state with anecdotes from backend', async () => {
    const mockAnecdotes = [
      { id: 1, content: 'Test', votes: 5 },
      { id: 2, content: 'Another', votes: 0 }
    ]
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })
})

describe('6.13 – sorting by votes', () => {
  it('returns anecdotes sorted by votes descending', () => {
    const unsorted = [
      { id: 1, content: 'Low', votes: 1 },
      { id: 2, content: 'High', votes: 10 },
      { id: 3, content: 'Medium', votes: 5 }
    ]
    useAnecdoteStoreRaw.setState({ anecdotes: unsorted, filter: '' })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current.map(a => a.votes)).toEqual([10, 5, 1])
  })
})

describe('6.14 – filtering', () => {
  const anecdotes = [
    { id: 1, content: 'React is awesome', votes: 3 },
    { id: 2, content: 'Zustand is great', votes: 2 },
    { id: 3, content: 'Testing is fun', votes: 1 }
  ]

  beforeEach(() => {
    useAnecdoteStoreRaw.setState({ anecdotes, filter: '' })
  })

  it('filters by content case‑insensitively', () => {
    const { result: actions } = renderHook(() => useAnecdoteActions())
    act(() => {
      actions.current.setFilter('react')
    })

    const { result: filtered } = renderHook(() => useAnecdotes())
    expect(filtered.current).toHaveLength(1)
    expect(filtered.current[0].content).toBe('React is awesome')
  })

  it('returns all when filter is empty', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(3)
  })
})

describe('6.15 – voting increases vote count', () => {
  it('increments votes of the correct anecdote', async () => {
    const initialAnecdotes = [
      { id: 1, content: 'First', votes: 0 },
      { id: 2, content: 'Second', votes: 5 }
    ]
    useAnecdoteStoreRaw.setState({ anecdotes: initialAnecdotes, filter: '' })

    const updatedAnecdote = { id: 1, content: 'First', votes: 1 }
    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    const { result: actions } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await actions.current.vote(1)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current.find(a => a.id === 1).votes).toBe(1)
    expect(anecdotesResult.current.find(a => a.id === 2).votes).toBe(5)
  })
})