import { useAnecdoteActions } from '../store';
import { useNotificationActions } from '../notificationStore'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdoteActions()
  const { setNotification } = useNotificationActions()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value.trim()
    if (content === '') {
      setNotification('Anecdote cannot be empty')
      return
    }
    await addAnecdote(content)
    setNotification(`Added: "${content}"`)
    e.target.reset()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="anecdote" />
      <button type="submit">create new</button>
    </form>
  )
}

export default AnecdoteForm