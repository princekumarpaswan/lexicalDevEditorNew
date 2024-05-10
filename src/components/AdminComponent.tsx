import {
  Autocomplete,
  Box,
  Button,
  Switch,
  // Switch,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
// import EditIcon from '@mui/icons-material/Edit'
// import { BaseLayout } from '../components/BaseLayout'
// import Switch from '@mui/material/Switch'
import { Link, useNavigate } from 'react-router-dom'
// import { EditNotifications } from '@mui/icons-material'

interface ColumnData {
  id: string
  label: string
  maxWidth?: number
  align?: 'center'
  format?: (value: number) => string
}

const Columndata: ColumnData[] = [
  { id: 'S.No', label: 'S.No', maxWidth: 20 },
  {
    id: 'Sub Topic Name',
    label: 'SubTopic Name',
    maxWidth: 20,
  },
  {
    id: 'Topic Name',
    label: 'Topic Name',
    maxWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Tutorial Name',
    label: 'Tutorial Name',
    maxWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Content Assignee Name',
    label: 'Content Assignee Name',
    maxWidth: 50,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Content Reviewer Name',
    label: 'Content Reviewer Name',
    maxWidth: 20,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Status',
    label: 'Status',
    maxWidth: 20,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
  {
    id: 'Publish/Unpublish',
    label: 'Publish / Unpublish',
    maxWidth: 20,
    align: 'center',
    format: (value: number) => value.toLocaleString('en-US'),
  },
]

interface rowDataProp {
  Id: string
  SNo: number
  subTopicName: string
  TopicName: string
  tutorialName: string
  contentAssigneeName: string
  ReviewerAssigneeName: string
  status: string
  // publish_Unpublish: ToggleEvent
}

// Create an array of objects
const rowsData: rowDataProp[] = [
  {
    Id: '2348923918579874389',
    SNo: 1,
    subTopicName: 'Hooks ',
    TopicName: 'React',
    tutorialName: 'Web Dev',
    contentAssigneeName: 'Lokesh',
    ReviewerAssigneeName: 'Rohan',
    status: 'Not assigned',
    // publish_Unpublish:  ,
  },
  {
    Id: '2348923918579874389',
    SNo: 1,
    subTopicName: 'Hooks ',
    TopicName: 'React',
    tutorialName: 'Web Dev',
    contentAssigneeName: 'Lokesh',
    ReviewerAssigneeName: 'Rohan',
    status: 'Not assigned',
    // publish_Unpublish:  ,
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

function AdminComponent() {
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
    // <BaseLayout title="Tutorial Content">
    <div>
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
            Tutorial Content
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
              <Button
                variant="contained"
                onClick={() =>
                  navigate('/tutorial-content/assign-tutorial-content')
                }
              >
                Assign Tutorial Content
              </Button>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={top100Films}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Filter Content" />
                )}
              />
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
                      style={{ maxWidth: column.maxWidth }}
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
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                      <TableCell align="left">{row.SNo}</TableCell>
                      <TableCell align="left">
                        <Link to={'{row.subTopicName}'}>
                          {row.subTopicName}
                        </Link>
                      </TableCell>
                      <TableCell align="center">{row.TopicName}</TableCell>
                      <TableCell align="center">{row.tutorialName}</TableCell>
                      <TableCell align="center">
                        {row.contentAssigneeName}
                      </TableCell>
                      <TableCell align="center">
                        {row.ReviewerAssigneeName}
                      </TableCell>
                      <TableCell align="center">{row.status}</TableCell>
                      <TableCell align="center">
                        {<Switch {...label} />}
                      </TableCell>
                      {/* <TableCell
                        align="center"
                        onClick={() => navigate(`/edit-tutorial/`)}
                      >
                        <EditNotifications
                          sx={{ cursor: 'pointer', color: 'blue' }}
                        />
                      </TableCell> */}
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
      {/* </BaseLayout>, */}
    </div>
  )
}

export default AdminComponent
