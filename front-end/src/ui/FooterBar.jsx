
import React from 'react'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

export default function FooterBar() {
  return (
    <Toolbar
      variant="dense"
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        width: '100vw',
        justifyContent: 'center',
        backgroundColor: 'action.disabledBackground'
      }}
    >
      <Typography
        variant="caption"
        sx={{
          '& a': {
            color: 'secondary.light'
          }
        }}
      >
        Caroline Avelar | <a href="mailto:caroline.avelar@example.com">caroline.avelar@aluno.cps.sp.gov.br</a>
      </Typography>
    </Toolbar>
  )
}
