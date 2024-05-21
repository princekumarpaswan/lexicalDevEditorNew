/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  Autocomplete,
  Box,
  Button,
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
        const response = searchQuery
          ? await searchTutorials(searchQuery)
          : await listAllTutorials(page + 1, rowsPerPage)

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
          ? await listAllTutorials(1, rowsPerPage)
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

  const handleFilterReset = async () => {
    try {
      setFilterCategoryId(null)
      setFilterStatus(null)
      setPage(0)
      setShowFilterBox(null)

      // Fetch all tutorials
      const response = await listAllTutorials(1, rowsPerPage)
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
    } catch (error) {
      console.error('Error updating tutorial status:', error)
    }
  }

  const toggleFilterBox = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilterBox(showFilterBox ? null : event.currentTarget)
  }

  const handleEditClick = (tutorialId: any) => {
    navigate(`/edit-tutorial/${tutorialId}`)
    console.log(tutorialId)
  }

  // const handleChangePage = (_event: unknown, newPage: number) => {
  //   setPage(newPage)
  // }
  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   setRowsPerPage(+event.target.value)
  //   setPage(0)
  // }

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
                {tutorials.map((tutorial, index) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={tutorial.ID}
                  >
                    <TableCell align="left">
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell align="left">{tutorial.tutorialName}</TableCell>
                    <TableCell align="center">
                      {tutorial.categoryName}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <p
                        style={{
                          backgroundColor:
                            tutorial.status === 'LISTED'
                              ? 'darkgreen'
                              : 'darkred',
                          color: 'white',
                          fontWeight: 'bold',
                          padding: 3,
                          borderRadius: 20,
                          width: 100,
                        }}
                      >
                        {tutorial.status}
                      </p>
                    </TableCell>
                    <TableCell align="center">
                      <BorderColorIcon
                        onClick={() => handleEditClick(tutorial.ID)}
                        sx={{ cursor: 'pointer', color: 'blue' }}
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
                ))}
              </TableBody>
            </Table>
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
                onClick={() => setPage(() => (page === 0 ? 1 : page - 1))}
                disabled={page === 0}
              >
                <ArrowBackIosIcon sx={{ fontSize: 17, fontWeight: 900 }} />
              </IconButton>
              <IconButton
                onClick={() => setPage(() => page + 1)}
                disabled={tutorials.length < rowsPerPage}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 17, fontWeight: 900 }} />
                <span style={{ fontSize: 16 }}>{page + 1}</span>
              </IconButton>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </BaseLayout>
  )
}

export default Tutorials
