import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import { BaseLayout } from '../../components/BaseLayout'
import { DeleteOutline, EditOutlined } from '@mui/icons-material'

interface ColumnData {
  id: string
  label: string
  minWidth?: number
  maxWidth?: number
  align?: 'center'
  format?: (value: number) => string
}

const Columndata: ColumnData[] = [
  { id: 'S.No', label: 'S.No', maxWidth: 200 },
  { id: 'Categories Name', label: 'Categories Name', minWidth: 100 },

  {
    id: 'Tutorials Mapped',
    label: 'Tutorials Mapped',
    minWidth: 200,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Actions ',
    label: 'Actions',
    minWidth: 200,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
]

interface rowDataProp {
  SNo: number
  ID: string
  tutorialsMapped: number
}

// Create an array of objects
const rowsData: rowDataProp[] = [
  {
    SNo: 1,
    ID: 'React ',
    tutorialsMapped: 2,
  },
  {
    SNo: 2,
    ID: ' Javascript',
    tutorialsMapped: 4,
  },
  {
    SNo: 3,
    ID: 'Javascript ',
    tutorialsMapped: 5,
  },
  {
    SNo: 4,
    ID: ' Javascript',
    tutorialsMapped: 2,
  },
  {
    SNo: 5,
    ID: ' Javascript',
    tutorialsMapped: 3,
  },
  {
    SNo: 6,
    ID: ' React',
    tutorialsMapped: 4,
  },
  {
    SNo: 7,
    ID: ' Javascript',
    tutorialsMapped: 4,
  },
]

function Categoriess() {
  // const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const [showModal, setShowModal] = React.useState(false)

  const [Categories, setCategories] = React.useState({
    _id: '',
    categoryName: '',
  })
  const [isEditing, setIsEditing] = React.useState(false)

  const handleEditCategories = (CategoriesData: any) => {
    setCategories(CategoriesData)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <BaseLayout title="Categories">
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2,
          }}
        >
          <Typography variant="h5" component="h5" mb={2}>
            Categories
          </Typography>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '10px',
              width: '50%',
            }}
          >
            <div
              style={{
                display: 'flex',
              }}
            >
              <Button
                variant="contained"
                sx={{ marginRight: 2 }}
                onClick={() => {
                  setShowModal(true)
                  setIsEditing(false)
                }}
              >
                Add Categories
              </Button>
            </div>
          </div>
        </Box>
      </Box>
      <Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {Columndata.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsData.map((row) => (
                  <TableRow key={row.ID}>
                    <TableCell align="left">{row.SNo}</TableCell>
                    <TableCell align="left">{row.ID}</TableCell>
                    <TableCell align="center">{row.tutorialsMapped}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        startIcon={<EditOutlined />}
                        style={{ marginRight: '12px' }}
                        onClick={() => handleEditCategories(row)}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rowsData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Category' : 'Add Category'}
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
            label="Category Name"
            variant="outlined"
            type="text"
            value={Categories.categoryName}
            onChange={(e) => {
              setCategories({
                ...Categories,
                categoryName: e.target.value,
              })
            }}
          />
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
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowModal(false)
              setIsEditing(false)
            }}
          >
            {isEditing ? 'Update Category' : 'Add Category'}
          </Button>
        </DialogActions>
      </Dialog>
    </BaseLayout>
  )
}

export default Categoriess
