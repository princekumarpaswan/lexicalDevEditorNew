import { Box, Button, Typography } from '@mui/material'
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
                onClick={() => navigate('/add-categories')}
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
                {rowsData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
                      <TableCell align="left">{row.SNo}</TableCell>
                      <TableCell align="left">{row.ID}</TableCell>
                      <TableCell align="center">
                        {row.tutorialsMapped}
                      </TableCell>

                      {/* <TableCell
                        align="center"
                        onClick={() => navigate(`/edit-categories/`)}
                      >
                        <EditIcon sx={{ cursor: 'pointer', color: 'blue' }} />
                      </TableCell> */}
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          startIcon={<EditOutlined />}
                          style={{ marginRight: '12px' }}
                          onClick={() => navigate('/edit-categories')}
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
    </BaseLayout>
  )
}

export default Categoriess
