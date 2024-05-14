import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
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
  { id: 'Tutorial Name', label: 'Tutorial Name', minWidth: 100 },
  {
    id: 'Category Name',
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
    id: 'Edit Tutorial',
    label: 'Edit Tutorial',
    minWidth: 200,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'List/ Dlist Tutorial',
    label: 'List/ Dlist Tutorial',
    minWidth: 200,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
]

interface rowDataProp {
  SNo: number
  ID: string
  title: string
}

// Create an array of objects
const rowsData: rowDataProp[] = [
  {
    SNo: 1,
    ID: 'React ',
    title: 'Web Dev',
  },
  {
    SNo: 2,
    ID: ' Javascript',
    title: 'Demo Tutorial 2',
  },
  {
    SNo: 3,
    ID: 'Javascript ',
    title: 'Demo Tutorial 3',
  },
  {
    SNo: 4,
    ID: ' Javascript',
    title: 'Demo Tutorial 4',
  },
  {
    SNo: 5,
    ID: ' Javascript',
    title: 'Demo Tutorial 5',
  },
  {
    SNo: 6,
    ID: ' React',
    title: 'Demo Tutorial 6',
  },
  {
    SNo: 7,
    ID: ' Javascript',
    title: 'Demo Tutorial 7',
  },
]

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
]

function Tutorials() {
  // const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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
                disablePortal
                id="combo-box-demo"
                options={top100Films}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter Content" />
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
                {rowsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                      <TableCell align="left">{row.SNo}</TableCell>
                      <TableCell align="left">{row.ID}</TableCell>
                      <TableCell align="center">{row.title}</TableCell>
                      <TableCell align="center">{row.title}</TableCell>

                      <TableCell
                        align="center"
                        onClick={() => navigate(`/edit-tutorial/`)}
                      >
                        <EditIcon sx={{ cursor: 'pointer', color: 'blue' }} />
                      </TableCell>
                      <TableCell align="center">
                        {<Switch {...label} />}
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
    </BaseLayout>
  )
}

export default Tutorials
