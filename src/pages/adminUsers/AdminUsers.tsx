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
import { createAdmin } from '../../api/adminAPI' // Import the API function

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
  _id: string
  name: string
  email: string
  role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
}

const AdminUsers = () => {
  const [showModal, setShowModal] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(true)

  const [user, setUser] = React.useState<AdminUser & { password: string }>({
    _id: '',
    name: '',
    email: '',
    password: '',
    role: 'ADMIN',
  })
  const [isEditing, setIsEditing] = React.useState(false)
  const [adminUsers, setAdminUsers] = React.useState<AdminUser[]>([]) // State to store admin users

  const handleEditUser = (userData: AdminUser) => {
    setUser({
      ...userData,
      _id: user._id,
      role: user.role,
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
        user.name,
        user.email,
        user.password,
        user.role,
      )
      // Handle the response as needed, e.g., update the adminUsers state
      console.log(response)
      // Update the adminUsers state with the new admin user
      setAdminUsers([...adminUsers, { ...user, _id: response._id }])
      setShowModal(false)
      setUser({
        _id: '',
        name: '',
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
                {adminUsers.map((user) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={user.email}
                    >
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          style={{ marginRight: '12px' }}
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button variant="contained" color="error">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Dialog
          open={showModal}
          onClose={() => {
            setShowModal(false)
            setUser({
              _id: '',
              name: '',
              email: '',
              password: '',
              role: 'ADMIN',
            })
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {isEditing ? 'Edit Employee' : 'Add Employee'}
          </DialogTitle>
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
              value={user.name}
              onChange={(e) => {
                setUser({
                  ...user,
                  name: e.target.value,
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
                        {user?._id ? 'Reset' : 'Generate'} password
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
                  _id: '',
                  name: '',
                  email: '',
                  password: '',
                  role: 'ADMIN',
                })
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                handleCreateAdmin()
              }}
            >
              {user._id ? 'Update user' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </BaseLayout>
    </>
  )
}

export default AdminUsers
