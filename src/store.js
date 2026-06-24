import { create } from 'zustand'
import { getAll, createNew, update, remove } from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await getAll()
      set({ anecdotes })
    },
    addAnecdote: async (content) => {
      const newAnecdote = await createNew(content)
      set(state => ({ anecdotes: [...state.anecdotes, newAnecdote] }))
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find(a => a.id === id)
      const updated = { ...anecdote, votes: anecdote.votes + 1 }
      const saved = await update(id, updated)
      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? saved : a)
      }))
    },
    deleteAnecdote: async (id) => {
      await remove(id)
      set(state => ({
        anecdotes: state.anecdotes.filter(a => a.id !== id)
      }))
    },
    setFilter: (filter) => set({ filter })
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)
  const filtered = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )
  return [...filtered].sort((a, b) => b.votes - a.votes)
}

export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)
export const useAnecdoteStoreRaw = useAnecdoteStore