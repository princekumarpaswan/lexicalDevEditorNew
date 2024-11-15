/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import { BaseLayout } from '../../components/BaseLayout'
import Switch from '@mui/material/Switch'
import {
  filterTutorials,
  getAllCategories,
  listAllTutorials,
  searchTutorials,
  updateTutorialStatus,
} from '../../api/tutorialAPI'
import { FilterAlt } from '@mui/icons-material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useDebounce } from '../../hooks/useDebounce'
import SnackbarComponent from '../../components/SnackBar'

interface ColumnData {
  id: string
  label: string
  minWidth?: number
  maxWidth?: number
  align?: 'center'
  format?: (value: number) => string
}

const Columndata: ColumnData[] = [
  { id: 'SNo', label: 'S.No', maxWidth: 200 },
  { id: 'TutorialName', label: 'Tutorial Name', minWidth: 100 },
  {
    id: 'CategoryName',
    label: 'Category Name',
    minWidth: 300,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Status',
    label: 'Status',
    minWidth: 200,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'EditTutorial',
    label: 'Edit Tutorial',
    minWidth: 200,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'ListDlistTutorial',
    label: 'List/ Dlist Tutorial',
    minWidth: 200,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
]

interface TutorialData {
  tutorialName: string
  SNo: number
  ID: string
  title: string
  categoryName: string
  status: string
}

function Tutorials() {
  const navigate = useNavigate()
  const theme = useTheme()

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [tutorials, setTutorials] = useState<TutorialData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const [showFilterBox, setShowFilterBox] = useState<null | HTMLElement>(null)

  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [filterCategoryOptions, setFilterCategoryOptions] = useState<string[]>(
    [],
  )
  const [categoryInputValue, setCategoryInputValue] = useState('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [isLoading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchTutorials = async () => {
  //     try {
  //       const response = searchQuery
  //         ? await searchTutorials(searchQuery)
  //         : await listAllTutorials(page + 1, rowsPerPage)

  //       if (response.success) {
  //         const data = response.data.map(
  //           (tutorial: {
  //             tutorialName: any
  //             id: any
  //             categoryName: any
  //             status: any
  //             index: number
  //           }) => ({
  //             tutorialName: tutorial.tutorialName,
  //             SNo: 0,
  //             ID: tutorial.id,
  //             categoryName: tutorial.categoryName,
  //             status: tutorial.status,
  //           }),
  //         )
  //         setTutorials(data)
  //       } else {
  //         console.error('Failed to fetch tutorials')
  //       }
  //     } catch (error) {
  //       console.error('Failed to fetch tutorials', error)
  //     }
  //   }

  //   fetchTutorials()
  // }, [page, rowsPerPage, searchQuery])
  const [isFilterApplied, setIsFilterApplied] = useState(false)
  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        setLoading(true)
        let response
        if (isFilterApplied) {
          response = await filterTutorials({
            categoryId: filterCategoryId,
            status: filterStatus,
            page: currentPage,
            limit: rowsPerPage,
          })
        } else if (debouncedSearchQuery) {
          response = await searchTutorials(
            debouncedSearchQuery,
            currentPage,
            rowsPerPage,
          )
        } else {
          response = await listAllTutorials(currentPage, rowsPerPage)
        }

        if (response.success) {
          const data = response.data.map(
            (tutorial: {
              tutorialName: any
              id: any
              categoryName: any
              status: any
              index: number
            }) => ({
              tutorialName: tutorial.tutorialName,
              SNo: 0,
              ID: tutorial.id,
              categoryName: tutorial.categoryName,
              status: tutorial.status,
            }),
          )
          setTutorials(data)
        } else {
          console.error('Failed to fetch tutorials')
        }
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch tutorials', error)
        setLoading(false)
      }
    }

    fetchTutorials()
  }, [debouncedSearchQuery, currentPage, rowsPerPage, isFilterApplied])

  interface Category {
    id: string
    categoryName: string
  }
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories()
        const data = response.data as Category[]
        setCategories(data)
      } catch (error) {
        console.error('Failed to fetch categories', error)
      }
    }

    fetchCategories()
  }, [])

  const handleSearchByTutorialName = (_event: any, value: string) => {
    setSearchQuery(value)
  }

  const handleFilterFetch = async () => {
    try {
      setLoading(true)
      setIsFilterApplied(true)
      const response = await filterTutorials({
        categoryId: filterCategoryId,
        status: filterStatus,
        page: currentPage,
        limit: rowsPerPage,
      })

      if (response.success) {
        const data = response.data.map(
          (tutorial: {
            tutorialName: any
            id: any
            categoryName: any
            status: any
            index: number
          }) => ({
            tutorialName: tutorial.tutorialName,
            SNo: 0,
            ID: tutorial.id,
            categoryName: tutorial.categoryName,
            status: tutorial.status,
          }),
        )
        setTutorials(data)
        setShowFilterBox(null)
      } else {
        console.error('Failed to fetch filtered tutorials')
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch filtered tutorials', error)
      setLoading(false)
    }
  }

  const handleFilterReset = async () => {
    setFilterCategoryId(null)
    setFilterStatus(null)
    setCategoryInputValue('')
    setCurrentPage(1)
    setRowsPerPage(10)
    setIsFilterApplied(false)
    setShowFilterBox(null)
  }

  const handleFilterCancel = () => {
    setShowFilterBox(null)
    setFilterCategoryId(null)
    setFilterStatus(null)
    setCategoryInputValue('')
  }

  const handleSwitchChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    tutorialId: string,
  ) => {
    const newStatus = event.target.checked ? 'LISTED' : 'DELISTED'

    try {
      const response = await updateTutorialStatus(tutorialId, newStatus)
      console.log('Tutorial status updated:', response)

      // Update the tutorial status in the `tutorials` state
      setTutorials((prevTutorials) =>
        prevTutorials.map((tutorial) =>
          tutorial.ID === tutorialId
            ? { ...tutorial, status: response.data.status }
            : tutorial,
        ),
      )
      setSnackbarMessage('Tutorial Status Updated Successfully')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error updating tutorial status:', error)
      setErrorMsg(
        'Cannot Update Tutorial Status as, None of its  subtopic is in published state',
      )
    }
  }

  const toggleFilterBox = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilterBox(showFilterBox ? null : event.currentTarget)
  }

  const handleEditClick = (tutorialId: any) => {
    navigate(`/edit-tutorial/${tutorialId}`)
    console.log(tutorialId)
  }

  const handleChangePage = async (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    try {
      setLoading(true)
      const response =
        filterCategoryId || filterStatus
          ? await filterTutorials({
              categoryId: filterCategoryId,
              status: filterStatus,
              page: newPage + 1, // Change here: page is newPage + 1
              limit: rowsPerPage,
            })
          : await listAllTutorials(newPage + 1, rowsPerPage)

      if (response.success) {
        const data = response.data.map(
          (tutorial: {
            tutorialName: any
            id: any
            categoryName: any
            status: any
            index: number
          }) => ({
            tutorialName: tutorial.tutorialName,
            SNo: 0,
            ID: tutorial.id,
            categoryName: tutorial.categoryName,
            status: tutorial.status,
          }),
        )
        setTutorials(data)
        setCurrentPage(newPage + 1) // Change here: update currentPage after the API call
      } else {
        console.error('Failed to fetch tutorials')
      }
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch tutorials', error)
      setLoading(false)
    }
  }

  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  return (
    <BaseLayout title="Tutorials">
      <Box>
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
              Tutorials
            </Typography>
          </Box>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 2,
              width: '50%',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 20,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: 20,
                  gap: 20,
                }}
              >
                <Grid item>
                  <Tooltip title="Filters for Tutorials">
                    <Button
                      variant="outlined"
                      endIcon={<FilterAlt color="primary" />}
                      onClick={toggleFilterBox}
                    >
                      Filters
                    </Button>
                  </Tooltip>
                </Grid>

                <Menu
                  anchorEl={showFilterBox}
                  open={Boolean(showFilterBox)}
                  onClose={handleFilterCancel}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  sx={{
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      padding: 3,
                      width: 550,
                    }}
                  >
                    <Grid
                      sx={{
                        display: 'flex',
                        gap: 4,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Grid item>
                        <Autocomplete
                          freeSolo
                          id="search-categories"
                          options={filterCategoryOptions}
                          inputValue={categoryInputValue}
                          onInputChange={(_event, value) => {
                            setCategoryInputValue(value)

                            if (value.trim() === '') {
                              setFilterCategoryId(null)
                              setFilterCategoryOptions([])
                            } else {
                              const filteredCategories = categories.filter(
                                (category) =>
                                  category.categoryName
                                    .toLowerCase()
                                    .includes(value.toLowerCase()),
                              )

                              setFilterCategoryOptions(
                                filteredCategories.map(
                                  (category) => category.categoryName,
                                ),
                              )
                              const selectedCategory = filteredCategories.find(
                                (category) =>
                                  category.categoryName.toLowerCase() ===
                                  value.toLowerCase(),
                              )
                              setFilterCategoryId(
                                selectedCategory ? selectedCategory.id : null,
                              )
                            }
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Filter by Category Name"
                            />
                          )}
                          sx={{ width: 280 }}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          select
                          label="Filter by Status"
                          value={filterStatus || ''}
                          onChange={(event) =>
                            setFilterStatus(event.target.value)
                          }
                          sx={{ width: 180 }}
                        >
                          <MenuItem value="Filter" disabled>
                            Select Item
                          </MenuItem>
                          <MenuItem value="LISTED">LISTED</MenuItem>
                          <MenuItem value="DELISTED">DELISTED</MenuItem>
                        </TextField>
                      </Grid>
                    </Grid>
                    <Grid
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 3,
                      }}
                    >
                      <Grid item>
                        <Button variant="outlined" onClick={handleFilterCancel}>
                          Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" onClick={handleFilterReset}>
                          Reset And Fetch
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button variant="contained" onClick={handleFilterFetch}>
                          Fetch
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Menu>
              </div>
              <Autocomplete
                freeSolo
                id="search-tutorials"
                options={[]}
                inputValue={searchQuery}
                onInputChange={handleSearchByTutorialName}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Search Tutorials" />
                )}
              />
              <Button
                variant="contained"
                sx={{ marginRight: 2 }}
                onClick={() => navigate('/tutorials/add-tutorial')}
              >
                Add Tutorial
              </Button>
            </div>
          </div>
        </Box>
      </Box>

      <Box>
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
                    {Columndata.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        <p style={{ fontSize: 15, fontWeight: 505 }}>
                          {column.label}
                        </p>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tutorials.length > 0 ? (
                    tutorials.map((tutorial, index) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={tutorial.ID}
                      >
                        <TableCell align="left">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="left">
                          {tutorial.tutorialName}
                        </TableCell>
                        <TableCell align="center">
                          {tutorial.categoryName}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          <p>
                            <Chip
                              label={tutorial.status}
                              style={{
                                fontWeight: 'bold',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                width: '180px',
                              }}
                              color={
                                tutorial.status === 'LISTED'
                                  ? 'success'
                                  : 'error'
                              }
                            />
                          </p>
                        </TableCell>
                        <TableCell align="center">
                          <BorderColorIcon
                            onClick={() => handleEditClick(tutorial.ID)}
                            sx={{
                              cursor: 'pointer',
                              color: theme.palette.primary.main,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Switch
                            checked={tutorial.status === 'LISTED'}
                            onChange={(event) =>
                              handleSwitchChange(event, tutorial.ID)
                            }
                            {...label}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No Data Found
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
                  onChange={(event) =>
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
                disabled={tutorials.length < rowsPerPage}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 17, fontWeight: 900 }} />
                <span style={{ fontSize: 16 }}>{currentPage}</span>
              </IconButton>
            </Box>
          </Stack>
        </Paper>
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
    </BaseLayout>
  )
}

export default Tutorials
