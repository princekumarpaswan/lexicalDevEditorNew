/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import EditIcon from '@mui/icons-material/Edit'
import { BaseLayout } from '../../components/BaseLayout'
import Switch from '@mui/material/Switch'
import {
  filterTutorials,
  getAllCategories,
  listAllTutorials,
  searchTutorials,
} from '../../api/tutorialAPI'
import { FilterAlt } from '@mui/icons-material'

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
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [tutorials, setTutorials] = useState<TutorialData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  // const [searchResults, setSearchResults] = useState<TutorialData[]>([])

  const [showFilterBox, setShowFilterBox] = useState<null | HTMLElement>(null)

  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [filterCategoryOptions, setFilterCategoryOptions] = useState<string[]>(
    [],
  )
  const [categoryInputValue, setCategoryInputValue] = useState('')

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const skip = page * rowsPerPage
        const limit = rowsPerPage
        const response = searchQuery
          ? await searchTutorials(searchQuery)
          : await listAllTutorials(skip, limit)

        if (response.success) {
          const data = response.data.map(
            (tutorial: {
              tutorialName: any
              id: any
              categoryName: any
              status: any
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
      } catch (error) {
        console.error('Failed to fetch tutorials', error)
      }
    }

    fetchTutorials()
  }, [page, rowsPerPage, searchQuery])

  interface Category {
    id: string
    categoryName: string
    // Add any other properties if needed
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

  const handleSearchByTutorialName = async (_event: any, value: string) => {
    setSearchQuery(value)
    try {
      const results =
        value.trim() === ''
          ? await listAllTutorials(0, rowsPerPage)
          : await searchTutorials(value)
      if (results.success) {
        const data = results.data.map(
          (tutorial: {
            tutorialName: any
            id: any
            categoryName: any
            status: any
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
        console.error('Failed to search tutorials')
      }
    } catch (error) {
      console.error('Failed to search tutorials', error)
    }
  }

  // const handleSearchByTutorialName = async (_event: any, value: string) => {
  //   setSearchQuery(value)
  //   try {
  //     const results = await searchTutorials(value)
  //     if (results.success) {
  //       const data = results.data.map(
  //         (tutorial: {
  //           tutorialName: any
  //           id: any
  //           categoryId: any
  //           status: any
  //         }) => ({
  //           tutorialName: tutorial.tutorialName,
  //           SNo: 0,
  //           ID: tutorial.id,
  //           title: tutorial.tutorialName,
  //           categoryName: tutorial.categoryId,
  //           status: tutorial.status,
  //         }),
  //       )
  //       setSearchResults(data)
  //     } else {
  //       console.error('Failed to search tutorials')
  //     }
  //   } catch (error) {
  //     console.error('Failed to search tutorials', error)
  //   }
  // }

  const handleFilterFetch = async () => {
    try {
      const filterParams = {
        categoryId: filterCategoryId || undefined,
        status: filterStatus || undefined,
      }

      const response = await filterTutorials(filterParams)
      const tutorials = response.data || []

      const data = tutorials.map(
        (tutorial: {
          tutorialName: string
          id: any
          categoryName: string
          status: string
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
    } catch (error) {
      console.error('Failed to filter tutorials', error)
    }
  }
  // const handleFilterFetch = async () => {
  //   try {
  //     const filterParams = {
  //       categoryId: filterCategoryId || undefined,
  //       status: filterStatus || undefined,
  //     }

  //     const response = await filterTutorials(filterParams)
  //     const tutorials = response.data || []
  //     console.log(filterParams)

  //     const data = tutorials.map(
  //       (tutorial: {
  //         tutorialName: string
  //         id: string
  //         categoryName: string
  //         status: string
  //       }) => ({
  //         tutorialName: tutorial.tutorialName,
  //         SNo: 0,
  //         ID: tutorial.id,
  //         categoryName: tutorial.categoryName,
  //         status: tutorial.status,
  //       }),
  //     )

  //     setTutorials(data)
  //     setShowFilterBox(null)
  //   } catch (error) {
  //     console.error('Failed to filter tutorials', error)
  //   }
  // }

  const handleFilterReset = async () => {
    try {
      setFilterCategoryId(null)
      setFilterStatus(null)
      setPage(0)
      setShowFilterBox(null)

      // Fetch all tutorials
      const response = await listAllTutorials(0, rowsPerPage)
      if (response.success) {
        const data = response.data.map(
          (tutorial: {
            tutorialName: any
            id: any
            categoryName: any
            status: any
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
    } catch (error) {
      console.error('Failed to fetch tutorials', error)
    }
  }

  const handleFilterCancel = () => {
    setFilterCategoryId(null)
    setFilterStatus(null)
    setShowFilterBox(null)
  }

  const toggleFilterBox = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilterBox(showFilterBox ? null : event.currentTarget)
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
          <Typography variant="h5" component="h5" mb={2}>
            Tutorials
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

                        {/* <Autocomplete
                          freeSolo
                          id="search-categories"
                          options={categories
                            .filter((category) =>
                              category.categoryName
                                .toLowerCase()
                                .includes(
                                  filterCategoryId?.toLowerCase() || '',
                                ),
                            )
                            .map((category) => category.categoryName)}
                          inputValue={filterCategoryId || ''}
                          onInputChange={(_event, value) => {
                            const selectedCategory = categories.find(
                              (category) =>
                                category.categoryName.toLowerCase() ===
                                value.toLowerCase(),
                            )
                            setFilterCategoryId(
                              selectedCategory ? selectedCategory.id : null,
                            )
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Filter by Category Name"
                            />
                          )}
                          sx={{ width: 280 }}
                        /> */}
                        {/* <Autocomplete
                          freeSolo
                          id="search-categories"
                          options={[]}
                          inputValue={filterCategoryId || ''}
                          onInputChange={(_event, value) =>
                            setFilterCategoryId(value)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Filter by Category Name"
                            />
                          )}
                          sx={{ width: 280 }}
                        /> */}
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
                {tutorials
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((tutorial, index) => (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={tutorial.ID}
                    >
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        {tutorial.tutorialName}
                      </TableCell>
                      <TableCell align="center">
                        {tutorial.categoryName}
                      </TableCell>
                      <TableCell align="center">{tutorial.status}</TableCell>
                      <TableCell
                        align="center"
                        onClick={() => navigate(`/edit-tutorial`)}
                      >
                        <EditIcon sx={{ cursor: 'pointer', color: 'blue' }} />
                      </TableCell>
                      <TableCell align="center">
                        <Switch {...label} />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={tutorials.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </BaseLayout>
  )
}

export default Tutorials
