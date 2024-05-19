import {
  Autocomplete,
  Box,
  Button,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import {  useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { Link, useNavigate } from 'react-router-dom'
import { contentTutorial } from '../api/tutorialContent'

interface ColumnData {
  id: string
  label: string
  maxWidth?: number
  align?: 'center'
  format?: (value: number) => string
}

interface tutorial {
  createdAt: string
  id: string
  reviewerAssignedAt: string | null
  reviewerInfo: null | string
  status: string
  subTopicDescription: string
  subTopicName: string
  topicId: string
  topicInfo: {
    id: string
    topicName: string
  }
  tutorialInfo: {
    id: string
    tutorialName: string
  }
  updatedAt: string
  writerAssignedAt: string | null
  writerInfo: null | string
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
  const [page, setPage] = useState(1)
  const [rowsPerPage] = useState(10)
  const [tutorialContentData, steTutorialContentData] = useState<tutorial[]>([])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await contentTutorial(page, rowsPerPage)
        steTutorialContentData(data.data)
      } catch (error) {
        return error
      }
    }
    fetchData()
  }, [page, rowsPerPage])


 

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
                {tutorialContentData.length > 0 ? (
                  tutorialContentData.map((row: tutorial, index: number) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      <TableCell align="left">{index + 1}</TableCell>
                      <TableCell align="left">
                        <Link to={'{row.subTopicName}'}>
                          {row.subTopicName}
                        </Link>
                      </TableCell>
                      <TableCell align="center">{row.subTopicName}</TableCell>
                      <TableCell align="center">
                        {row.tutorialInfo.tutorialName}
                      </TableCell>
                      <TableCell align="center">
                        {row.writerInfo ? 'row.writerInfo ' : 'Not Assigned'}
                      </TableCell>
                      <TableCell align="center">
                        {row.reviewerInfo ? 'row.reviewerInfo' : 'Not Assigned'}
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
                  ))
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '40%',
                      marginLeft: '55%',
                    }}
                  >
                    Loading...
                  </div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Stack
          sx={{ marginTop: '2%', justifyContent: 'flex-end' }}
          direction="row"
          spacing={2}
        >
          <Button
            onClick={() => setPage(() => page == 0 ? 1 : page - 1)}
            variant="outlined"
            startIcon={'<'}
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(() => page == 0 ? 1 : page + 1)}
            variant="contained"
            endIcon={'>'}
            disabled={page == 0 ? true : false}
          >
            Page - {page == 0 ? 1 : page }
          </Button>
        </Stack>
      </Box>
      {/* </BaseLayout>, */}
    </div>
  )
}

export default AdminComponent
