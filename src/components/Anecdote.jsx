const Anecdote = ({ anecdote, handleVote, handleDelete }) => {
  return (
    <li style={{ marginBottom: '0.5rem' }}>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes} vote(s)
        <button onClick={() => handleVote(anecdote)} style={{ marginLeft: '0.5rem' }}>
          vote
        </button>
        {anecdote.votes === 0 && (
          <button onClick={() => handleDelete(anecdote.id)} style={{ marginLeft: '0.5rem' }}>
            delete
          </button>
        )}
      </div>
    </li>
  )
}

export default Anecdote