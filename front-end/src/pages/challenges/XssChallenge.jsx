
import React from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import myfetch from '../../lib/myfetch'

export default function XssChallenge() {
  const [content, setContent] = React.useState('')
  const [comments, setComments] = React.useState([])
  const [error, setError] = React.useState(null)

  async function loadComments() {
    try {
      setComments(await myfetch.get('/challenges/xss/comments'))
    }
    catch(error) {
      setError(error.message)
    }
  }

  React.useEffect(() => { loadComments() }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    try {
      await myfetch.post('/challenges/xss/comments', { content })
      setContent('')
      await loadComments()
    }
    catch(error) {
      setError(error.message)
    }
  }

  return <Stack spacing={3}>
    <Typography variant="h1">Desafio: XSS armazenado</Typography>
    <Alert severity="warning">
      Esta tela renderiza comentários sem escape de propósito. Use somente dados de laboratório.
    </Alert>
    {error && <Alert severity="error">{error}</Alert>}

    <Paper sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Comentário"
            value={content}
            onChange={event => setContent(event.target.value)}
            multiline
            required
            fullWidth
          />
          <Button type="submit" variant="contained" color="secondary">
            Publicar comentário
          </Button>
        </Stack>
      </form>
    </Paper>

    <Paper sx={{ p: 3 }}>
      <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>
        Comentários
      </Typography>

      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
        </div>
      ))}
    </Paper>
  </Stack>
}
