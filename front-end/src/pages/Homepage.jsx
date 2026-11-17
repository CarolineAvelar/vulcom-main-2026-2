
import React from 'react'
import Typography from '@mui/material/Typography'

export default function Homepage() {

  const [entries, setEntries] = React.useState([])
  const [cookies, setCookies] = React.useState([])

  React.useEffect(() => {

    const data = Object.keys(localStorage).map(key => ({
      key,
      value: localStorage.getItem(key)
    }))

    setEntries(data)

    const cookieData = document.cookie
      .split(';')
      .filter(cookie => cookie.trim() !== '')
      .map(cookie => {
        const parts = cookie.trim().split('=')

        return {
          key: parts.shift(),
          value: decodeURIComponent(parts.join('='))
        }
      })

    setCookies(cookieData)

  }, [])

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Projeto VULCOM
      </Typography>

      <Typography>
        Sistema para análise e estudo de vulnerabilidades comuns
      </Typography>

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        Entradas do Local Storage
      </Typography>

      {entries.length === 0 ? (
        <Typography>Nenhuma entrada encontrada.</Typography>
      ) : (
        <ul>
          {entries.map(entry => (
            <li key={entry.key}>
              <Typography component="div">
                <strong>Chave:</strong> {entry.key}
              </Typography>

              <Typography
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
              >
                {entry.value}
              </Typography>
            </li>
          ))}
        </ul>
      )}

      <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>
        Cookies encontrados
      </Typography>

      <Typography>
        Cookies acessíveis nesta página via document.cookie.
        Cookies HttpOnly não podem ser lidos pelo JavaScript.
      </Typography>

      {cookies.length === 0 ? (
        <Typography>Nenhum cookie encontrado.</Typography>
      ) : (
        <ul>
          {cookies.map(cookie => (
            <li key={`${cookie.key}=${cookie.value}`}>
              <Typography component="div">
                <strong>Nome:</strong> {cookie.key}
              </Typography>

              <Typography
                component="pre"
                sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
              >
                {cookie.value}
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
