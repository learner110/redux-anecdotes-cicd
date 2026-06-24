import { useAnecdotes, useAnecdoteActions } from '../store'
import { useNotificationActions } from '../notificationStore'
import Anecdote from './Anecdote'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, deleteAnecdote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const handleVote = async (anecdote) => {
    await vote(anecdote.id)
    setNotification(`You voted '${anecdote.content}'`)
  }

  const handleDelete = async (id) => {
    const anecdote = anecdotes.find(a => a.id === id)
    await deleteAnecdote(id)
    setNotification(`Deleted: "${anecdote.content}"`)
  }

  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleVote={handleVote}
          handleDelete={handleDelete}
        />
      ))}
    </ul>
  )
}

export default AnecdoteList