// import React, { useContext } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
// import { Interceptor, LocalStorage } from '../helpers/classes'
// import AuthApi from '../api/managers/auth'
// import { AuthContext } from '../context/AuthContext'
// import { useNavigate } from 'react-router-dom'
// import { CircularProgress } from '@mui/material'

const theme = createTheme()

export default function Login() {
  //   const [loading, setLoading] = React.useState(false)
  //   const { setUser } = useContext(AuthContext) || {}
  //   const navigate = useNavigate()

  //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault()
  //     const data = new FormData(event.currentTarget)
  //     const request = {
  //       email: data.get('email') as string,
  //       password: data.get('password') as string,
  //     }
  //     await Interceptor.handleApi(
  //       async () => await AuthApi.login(request),
  //       setLoading,
  //       (res) => {
  //         setUser && setUser(res)
  //         LocalStorage.set('user', res ?? null)
  //         navigate('/courses')
  //       },
  //     )
  //   }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 1,
            borderRadius: 4,
            padding: 3,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <img
            style={{ maxWidth: 200, padding: '5px 0px 20    px 17px' }}
            src="/images/euronlogo.png"
          />
          <Typography component="h1" variant="h5" sx={{ marginTop: 3 }}>
            Sign in to Euron <span style={{ color: 'darkblue' }}>Tutorial </span>
            Admin
          </Typography>
          <Box
            component="form"
            // onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              //   type={loading ? 'button' : 'submit'}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {/* {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Sign in'
              )} */}
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
