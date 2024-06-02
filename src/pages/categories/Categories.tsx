/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
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
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
} from '../../api/categoryAPI'
import { useDebounce } from '../../hooks/useDebounce'
import SnackbarComponent from '../../components/SnackBar'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface Category {
  id: string
  categoryName: string
  mappedTutorials: string
}

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

function Categories() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [categoryToAdd, setCategoryToAdd] = useState<Category>({
    id: '',
    categoryName: '',
    mappedTutorials: '',
  })
  const [categoryToEdit, setCategoryToEdit] = useState<Category>({
    id: '',
    categoryName: '',
    mappedTutorials: '',
  })

  const [Categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = debouncedSearchQuery
          ? await searchCategories(debouncedSearchQuery)
          : await getAllCategories()
        setCategories(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [debouncedSearchQuery])

  const handleSearchInput = (_event: any, value: string) => {
    setSearchQuery(value)
  }

  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const response = await getAllCategories()
  //       setCategories(response.data)
  //       console.log(response.data)
  //     } catch (error) {
  //       console.error('Error fetching categories:', error)
  //     }
  //   }

  //   fetchCategories()
  // }, [])

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const handleAddCategory = async () => {
    try {
      const response = await createCategory(categoryToAdd.categoryName)
      setCategories((prevCategories) => [...prevCategories, response.data])
      setShowAddModal(false)
      setCategoryToAdd({ id: '', categoryName: '', mappedTutorials: '' })
      setSnackbarMessage('Category added successfully!')
      setSnackbarOpen(true)

      const allCategoriesResponse = await getAllCategories()
      setCategories(allCategoriesResponse.data)
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const handleEditCategory = async () => {
    try {
      const response = await updateCategory(
        categoryToEdit.id,
        categoryToEdit.categoryName,
      )
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryToEdit.id ? response.data : category,
        ),
      )
      const allCategoriesResponse = await getAllCategories()
      setCategories(allCategoriesResponse.data)
      setShowEditModal(false)
      setCategoryToEdit({ id: '', categoryName: '', mappedTutorials: '' })
      setSnackbarMessage('Category Updated successfully!')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error editing category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId),
      )
      setSnackbarMessage('Category Deleted successfully!')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error deleting category:', error)
      setErrorMsg('Cannot Delete Category bacause its already Mapped')
      setSnackbarOpen(true)
    }
  }

  return (
    <BaseLayout title="Categories">
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              gap: 2,
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              color="inherit"
              size="large"
            >
              <ArrowBackIcon />
            </IconButton>

            <Typography variant="h5" component="h5">
              Categories
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 4 }}>
            <Autocomplete
              freeSolo
              id="search-category"
              options={[]}
              onInputChange={handleSearchInput}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Search Category" />
              )}
            />
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              onClick={() => setShowAddModal(true)}
            >
              Add Category
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 570,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {Columndata.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        <p style={{ fontSize: 14, fontWeight: 505 }}>
                          {column.label}
                        </p>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {Categories.map((category: Category, index: number) => (
                    <TableRow key={category.id}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        {category.categoryName}
                      </TableCell>
                      <TableCell align="center">
                        {category.mappedTutorials}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          startIcon={<EditOutlined />}
                          style={{ marginRight: '12px' }}
                          onClick={() => {
                            setCategoryToEdit(category)
                            setShowEditModal(true)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<DeleteOutline />}
                          variant="contained"
                          color="error"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={setCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      <Dialog
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            variant="outlined"
            type="text"
            value={categoryToAdd.categoryName}
            onChange={(e) =>
              setCategoryToAdd({
                ...categoryToAdd,
                categoryName: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
          <Button onClick={() => setShowAddModal(false)} color="error">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            variant="outlined"
            type="text"
            value={categoryToEdit.categoryName}
            onChange={(e) =>
              setCategoryToEdit({
                ...categoryToEdit,
                categoryName: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCategory} color="primary">
            Save
          </Button>
          <Button onClick={() => setShowEditModal(false)} color="error">
            Cancel
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
  )
}

export default Categories
