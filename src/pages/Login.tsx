/* eslint-disable no-console */
import React, { useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { loginUser } from '../api/authAPI'
import { AuthContext } from '../context/AuthContext/AuthContext'
import { useNavigate } from 'react-router-dom'
import { CircularProgress, IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import SnackbarComponent from '../components/SnackBar'

const theme = createTheme()

export default function Login() {
  const [loading, setLoading] = React.useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { accessToken, role } = await loginUser(email, password)
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: {
            id: '', // Placeholder value for id
            fullName: '', // Placeholder value for fullName
            email,
            role,
          },
          accessToken,
        },
      })
      setSnackbarOpen(true)
      setSnackbarMessage('Login SuccessFull')
      // Redirect to the appropriate page based on the role
      switch (role) {
        case 'ADMIN':
          navigate('/tutorials')
          break
        case 'CONTENT_WRITER':
          navigate('/tutorial-content')
          break
        case 'CONTENT_REVIEWER':
          navigate('/tutorial-content')
          break
        default:
          console.error('Invalid role')
          break
      }
    } catch (error) {
      console.error('Login failed:', error)
      setSnackbarOpen(true)
      setErrorMsg('Wrong User name or Password')
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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
            style={{ maxWidth: 200, padding: '5px 0px 20px 17px' }}
            src="/images/euronlogo.png"
          />
          <Typography component="h1" variant="h5" sx={{ marginTop: 3 }}>
            Sign in to Euron{' '}
            <span style={{ color: 'darkblue' }}>Tutorial </span>
            Admin
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={togglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                ),
              }}
            />
            <Button
              type={loading ? 'button' : 'submit'}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#fff' }} />
              ) : (
                'Sign in'
              )}
            </Button>
          </Box>
        </Box>
        <SnackbarComponent
          severity="success"
          open={snackbarOpen}
          message={snackbarMessage}
          closeSnackbar={() => setSnackbarOpen(false)}
        />
        <SnackbarComponent
          severity="error"
          message={errorMsg}
          open={!!errorMsg}
          closeSnackbar={() => setErrorMsg('')}
        />
      </Container>
    </ThemeProvider>
  )
}
