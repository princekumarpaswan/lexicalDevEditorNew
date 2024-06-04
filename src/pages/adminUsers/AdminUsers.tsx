/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
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
  CircularProgress,
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
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  createAdmin,
  getAllAdminUsers,
  updateAdminInfo,
} from '../../api/adminAPI'
import { deleteAdminUser } from '../../api/adminAPI'
import SnackbarComponent from '../../components/SnackBar'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'

interface Column {
  id: 'S.No' | 'name' | 'email' | 'actions'
  label: string
  maxWidth?: number
  align?: 'left'
}

const columns: readonly Column[] = [
  { id: 'S.No', label: 'S.No', maxWidth: 100 },
  { id: 'name', label: 'Name', maxWidth: 200, align: 'left' },
  { id: 'email', label: 'Email', maxWidth: 170, align: 'left' },
  {
    id: 'actions',
    label: 'Actions',
    maxWidth: 170,
    align: 'left',
  },
]

interface AdminUser {
  password?: string
  id: string
  fullName: string
  email: string
  role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
}

interface UpdateAdminPayload {
  newName: string
  newRole: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
  newEmail: string
  newPassword?: string
}

const AdminUsers = () => {
  const [showModal, setShowModal] = useState(false)
  const [showPassword, setShowPassword] = useState(true)
  const [userData, setUserData] = useState<AdminUser | null>(null)

  const [user, setUser] = useState<AdminUser & { password: string }>({
    id: '',
    fullName: '',
    email: '',
    password: '',
    role: 'ADMIN',
  })

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditing, setIsEditing] = useState(false)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [error, setError] = useState<string | null>(null)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        setIsLoading(true)
        const response = await getAllAdminUsers(currentPage, rowsPerPage)
        setAdminUsers(response.data)
        setIsLoading(false)
      } catch (error) {
        setError('Error fetching admin users')
        console.error('Error fetching admin users:', error)
      }
    }

    fetchAdminUsers()
  }, [currentPage, rowsPerPage])

  // useEffect(() => {
  //   const fetchAdminUsers = async () => {
  //     try {
  //       setIsLoading(true)
  //       const response = await getAllAdminUsers()
  //       const { data } = response
  //       setAdminUsers(data)
  //       setIsLoading(false)
  //     } catch (error) {
  //       setError('Error fetching admin users')
  //       console.error('Error fetching admin users:', error)
  //     }
  //   }

  //   fetchAdminUsers()
  // }, [])

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setCurrentPage(newPage + 1)
  }

  if (error) {
    return <div>{error}</div>
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteAdminUser(userId)
      setAdminUsers(adminUsers.filter((user) => user.id !== userId))
      setSnackbarOpen(true)
      setSnackbarMessage('User Deleted Successfully')
    } catch (error) {
      console.error('Error deleting admin user:', error)
    }
  }

  const handleEditButton = (userData: AdminUser) => {
    setUser({
      ...userData,
      password: '',
    })
    setUserData(userData)
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
      if (isEditing) {
        const payload: UpdateAdminPayload = {
          newName: user.fullName,
          newRole: user.role,
          newEmail: user.email,
          ...(userData &&
            user.password !== userData.password && {
              newPassword: user.password,
            }),
        }
        await updateAdminInfo(user.id, payload)
        setAdminUsers(
          adminUsers.map((adminUser) =>
            adminUser.id === user.id ? { ...user } : adminUser,
          ),
        )
        setSnackbarOpen(true)
        setSnackbarMessage('User Details Added Successfully')
      } else {
        const response = await createAdmin(
          user.fullName,
          user.email,
          user.password,
          user.role,
        )
        setAdminUsers([...adminUsers, { ...user, id: response.id }])
      }
      setSnackbarOpen(true)
      setSnackbarMessage('User Details Added Successfully')
      setShowModal(false)
      setUser({
        id: '',
        fullName: '',
        email: '',
        password: '',
        role: 'ADMIN',
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error creating/updating admin:', error)
      setSnackbarOpen(true)
      setErrorMsg('Something Went Wrong')
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" component="h5">
              Admin Users
            </Typography>
          </Box>
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
          <TableContainer
            sx={{
              maxHeight: `calc(100vh - 240px)`,
              overflowY: 'auto',
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 770,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => {
                      return (
                        <>
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ maxWidth: column.maxWidth }}
                          >
                            <p style={{ fontSize: 14, fontWeight: 505 }}>
                              {column.label}
                            </p>
                          </TableCell>
                        </>
                      )
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(adminUsers) && adminUsers.length > 0 ? (
                    adminUsers.map((user, index: number) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={user.email}
                        >
                          <TableCell align="left">{index + 1}</TableCell>
                          <TableCell sx={{ textAlign: 'left' }}>
                            {user.fullName}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'left' }}>
                            {user.email}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'left' }}>
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
            )}
          </TableContainer>
          <Stack
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginRight: 3,
              gap: 4,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span style={{ fontSize: 14 }}>Rows Per Page : </span>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 50 }}>
                <Select
                  labelId="demo-simple-select-standard-label"
                  id="demo-simple-select-standard"
                  displayEmpty
                  value={rowsPerPage}
                  onChange={(event: { target: { value: any } }) =>
                    setRowsPerPage(Number(event.target.value))
                  }
                  sx={{ maxWidthidth: 90 }}
                >
                  {[10, 50, 100, 500].map((rows) => (
                    <MenuItem key={rows} value={rows}>
                      {rows}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <IconButton
                onClick={(event) =>
                  handleChangePage(event, Math.max(currentPage - 2, 0))
                }
                disabled={currentPage === 1}
              >
                <ArrowBackIosIcon sx={{ fontSize: 17, fontWeight: 900 }} />
              </IconButton>
              <IconButton
                onClick={(event) => handleChangePage(event, currentPage)}
                disabled={adminUsers.length < rowsPerPage}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 17, fontWeight: 900 }} />
                <span style={{ fontSize: 16 }}>{currentPage}</span>
              </IconButton>
            </Box>
          </Stack>
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
                onChange={(e) => {
                  setUser({
                    ...user,
                    password: e.target.value,
                  })
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
      </BaseLayout>
    </>
  )
}

export default AdminUsers
