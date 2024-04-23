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

import {
  DeleteOutline,
  EditOutlined,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material'

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
const data = [
  { id: 1, name: 'Lokesh', email: 'lokesh@example.com' },
  { id: 2, name: 'Demo User', email: 'demo@example.com' },
]

const AdminUsers = () => {
  const [showModal, setShowModal] = React.useState(false)
  const [showPassword, setShowPassword] = React.useState(true)

  const [user, setUser] = React.useState({
    _id: '',
    name: '',
    email: '',

    password: '',
    assignedPrograms: [] as string[],
  })
  const [isEditing, setIsEditing] = React.useState(false)

  const handleEditUser = (userData: any) => {
    setUser(userData)
    setIsEditing(true)
    setShowModal(true)
  }
  // const createAdminUser = async () => {
  //   setShowModal(false)
  //   setSuccess('Admin user added successfully!')
  // }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleOnMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
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
                {data?.map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.email}
                    >
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          startIcon={<EditOutlined />}
                          style={{ marginRight: '12px' }}
                          onClick={() => handleEditUser(row)}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<DeleteOutline />}
                          variant="contained"
                          color="error"
                        >
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
              assignedPrograms: [],
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
                // value={age}
                label="Age"
                // onChange={handleChange}
              >
                <MenuItem value={10}>Admin</MenuItem>
                <MenuItem value={20}>Content Writer</MenuItem>
                <MenuItem value={30}>Content Reviewer</MenuItem>
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
                  assignedPrograms: [],
                })
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setShowModal(false)
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
