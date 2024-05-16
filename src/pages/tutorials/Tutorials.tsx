/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material'
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
import { listAllTutorials, searchTutorials } from '../../api/tutorialAPI'

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
  const [searchResults, setSearchResults] = useState<TutorialData[]>([])

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

  const handleSearch = async (_event: any, value: string) => {
    setSearchQuery(value)
    try {
      const results = await searchTutorials(value)
      if (results.success) {
        const data = results.data.map(
          (tutorial: {
            tutorialName: any
            id: any
            categoryId: any
            status: any
          }) => ({
            tutorialName: tutorial.tutorialName,
            SNo: 0,
            ID: tutorial.id,
            title: tutorial.tutorialName,
            categoryName: tutorial.categoryId,
            status: tutorial.status,
          }),
        )
        setSearchResults(data)
      } else {
        console.error('Failed to search tutorials')
      }
    } catch (error) {
      console.error('Failed to search tutorials', error)
    }
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
              <Autocomplete
                freeSolo
                id="search-tutorials"
                options={searchResults.map((result) => result.tutorialName)}
                onInputChange={handleSearch}
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
                        onClick={() =>
                          navigate(`/edit-tutorial/${tutorial.ID}`)
                        }
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
