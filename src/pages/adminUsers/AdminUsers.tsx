/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { BaseLayout } from '../../components/BaseLayout'
import { Box } from '@mui/system'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { createAdmin, getAllAdminUsers } from '../../api/adminAPI'
import { deleteAdminUser } from '../../api/adminAPI'

interface Column {
  id: 'name' | 'email' | 'actions'
  label: string
  minWidth?: number
  align?: 'right' | 'center'
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 170,
    align: 'right',
  },
]

interface AdminUser {
  id: string
  fullName: string
  email: string
  role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
}

const AdminUsers = () => {
  const [showModal, setShowModal] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(true)

  const [user, setUser] = React.useState<AdminUser & { password: string }>({
    id: '',
    fullName: '',
    email: '',
    password: '',
    role: 'ADMIN',
  })
  const [isEditing, setIsEditing] = React.useState(false)
  const [adminUsers, setAdminUsers] = React.useState<AdminUser[]>([]) // State to store admin users
  // const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const response = await getAllAdminUsers()
        const { data } = response // Destructure the 'data' property from the response
        setAdminUsers(data) // Update the adminUsers state with the array of admin users
      } catch (error) {
        setError('Error fetching admin users')
        console.error('Error fetching admin users:', error)
      }
    }

    fetchAdminUsers()
  }, [])

  console.log(adminUsers)

  // Handle loading and error states
  // if (isLoading) {
  //   return <div>Loading...</div>
  // }

  if (error) {
    return <div>{error}</div>
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteAdminUser(userId)
      setAdminUsers(adminUsers.filter((user) => user.id !== userId))
    } catch (error) {
      console.error('Error deleting admin user:', error)
    }
  }
  console.log(user.id)

  const handleEditButton = (userData: AdminUser) => {
    setUser({
      ...userData,
      password: (Math.random() + 1).toString(36).substring(2),
    })
    setIsEditing(true)
    setShowModal(true)
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleOnMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleCreateAdmin = async () => {
    try {
      const response = await createAdmin(
        user.fullName,
        user.email,
        user.password,
        user.role,
      )
      setAdminUsers([...adminUsers, { ...user, id: response.id }])
      setShowModal(false)
      setUser({
        id: '',
        fullName: '',
        email: '',
        password: '',
        role: 'ADMIN',
      })
    } catch (error) {
      console.error('Error creating admin:', error)
    }
  }

  return (
    <>
      <BaseLayout title={'Admin Users'}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <Typography variant="h5" component="h5" mb={2}>
            Admin Users
          </Typography>
          <Box>
            <Button
              variant="contained"
              onClick={() => {
                setShowModal(true)
                setUser({
                  ...user,
                  password: (Math.random() + 1).toString(36).substring(2),
                })
              }}
            >
              ADD Users
            </Button>
          </Box>
        </Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => {
                    return (
                      <>
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      </>
                    )
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(adminUsers) && adminUsers.length > 0 ? (
                  adminUsers.map((user) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={user.email}
                      >
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell align="right">
                          <Button
                            variant="contained"
                            style={{ marginRight: '12px' }}
                            onClick={() => handleEditButton(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No admin users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Dialog
          open={showModal}
          onClose={() => {
            setShowModal(false)
            setUser({
              id: '',
              fullName: '',
              email: '',
              password: '',
              role: 'ADMIN',
            })
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{isEditing ? 'Edit Uzer' : 'Add User'}</DialogTitle>
          <DialogContent
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              padding: '10px 24px',
            }}
          >
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              type="text"
              value={user.fullName}
              onChange={(e) => {
                setUser({
                  ...user,
                  fullName: e.target.value,
                })
              }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={user.email}
              onChange={(e) => {
                setUser({
                  ...user,
                  email: e.target.value,
                })
              }}
            />
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={user.role}
                label="Role"
                onChange={(e) => {
                  setUser({
                    ...user,
                    role: e.target.value as
                      | 'ADMIN'
                      | 'CONTENT_WRITER'
                      | 'CONTENT_REVIEWER',
                  })
                }}
              >
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="CONTENT_WRITER">Content Writer</MenuItem>
                <MenuItem value="CONTENT_REVIEWER">Content Reviewer</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <TextField
                variant="outlined"
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={user.password}
                InputLabelProps={{ shrink: true }}
                helperText="Please copy the password before saving"
                FormHelperTextProps={{
                  style: { marginLeft: '0px' },
                }}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        aria-label="generate password"
                        color="success"
                        onClick={() => {
                          navigator?.clipboard?.writeText(user?.password)
                        }}
                      >
                        Copy password
                      </Button>
                      <Button
                        aria-label="generate password"
                        onClick={() => {
                          setUser({
                            ...user,
                            password: (Math.random() + 1)
                              .toString(36)
                              .substring(2),
                          })
                        }}
                      >
                        {user?.id ? 'Reset' : 'Generate'} password
                      </Button>
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleShowPassword}
                        onMouseDown={handleOnMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </DialogContent>
          <DialogActions
            style={{
              padding: '24px',
            }}
          >
            <Button
              color="error"
              onClick={() => {
                setShowModal(false)
                setUser({
                  id: '',
                  fullName: '',
                  email: '',
                  password: '',
                  role: 'ADMIN',
                })
                setIsEditing(false)
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleCreateAdmin}>
              {isEditing ? 'Update User' : 'Add User '}
            </Button>
          </DialogActions>
        </Dialog>
      </BaseLayout>
    </>
  )
}

export default AdminUsers
