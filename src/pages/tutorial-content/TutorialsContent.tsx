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
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { SetStateAction, useContext, useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Link, useNavigate } from 'react-router-dom'
import {
  FilterSubtopics,
  GetAdminUsersByRole,
  contentTutorial,
  searchSubTopics,
} from '../../api/tutorialContentAPI'
import { BaseLayout } from '../../components/BaseLayout'
import { AuthContext } from '../../context/AuthContext/AuthContext'
import { FilterAlt } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useDebounce } from '../../hooks/useDebounce'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

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

interface AdminUser {
  id: string
  fullName: string
  email: string
  role: string
}

interface SubTopic {
  id: string
  topicId: string
  subTopicName: string
  status: string
  subTopicDescription: string
  createdAt: string
  updatedAt: string
  reviewerAssignedAt: string | null
  writerAssignedAt: string | null
  topicInfo: { id: string; topicName: string }
  writerInfo: any
  reviewerInfo: any
  tutorialInfo: { id: string; tutorialName: string }
}

const Columndata: ColumnData[] = [
  { id: 'S.No', label: 'S.No', maxWidth: 20 },
  {
    id: 'Sub Topic Name',
    label: 'SubTopic Name',
    maxWidth: 40,
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
    id: 'Content Writer Name',
    label: 'Content Writer Name',
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

function TutorialContent() {
  const navigate = useNavigate()
  const { state } = useContext(AuthContext)
  const role = state.user?.role

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showFilterBox, setShowFilterBox] = useState<null | HTMLElement>(null)
  const [selectedWriter, setSelectedWriter] = useState<string>('')
  const [selectedReviewer, setSelectedReviewer] = useState<string>('')
  const [contentWriters, setContentWriters] = useState<
    { id: string; name: string }[]
  >([])
  const [contentReviewers, setContentReviewers] = useState<
    { id: string; name: string }[]
  >([])
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const [tutorialContentData, steTutorialContentData] = useState<tutorial[]>([])

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    const handleSearchByContentName = async (value: string) => {
      try {
        setLoading(true)
        const results =
          value.trim() === ''
            ? await contentTutorial(page, rowsPerPage)
            : await searchSubTopics(value)
        if (results.success) {
          steTutorialContentData(results.data)
          setLoading(false)
        } else {
          console.error('Failed to search content')
        }
      } catch (error) {
        console.error('Failed to search content', error)
      }
    }

    handleSearchByContentName(debouncedSearchQuery)
  }, [debouncedSearchQuery, page, rowsPerPage])

  const handleInputChange = (_event: any, value: SetStateAction<string>) => {
    setSearchQuery(value)
  }

  // const handleSearchByContentName = async (_event: any, value: string) => {
  //   setSearchQuery(value)
  //   try {
  //     const results =
  //       value.trim() === ''
  //         ? await contentTutorial(page, rowsPerPage)
  //         : await searchSubTopics(value)
  //     if (results.success) {
  //       steTutorialContentData(results.data)
  //     } else {
  //       console.error('Failed to search content')
  //     }
  //   } catch (error) {
  //     console.error('Failed to search content', error)
  //   }
  // }

  const fetchAdminUsers = async () => {
    try {
      const writersResponse = await GetAdminUsersByRole('CONTENT_WRITER')
      const writers = writersResponse.data.map((writer: AdminUser) => ({
        id: writer.id,
        name: writer.fullName,
      }))
      setContentWriters(writers)

      const reviewersResponse = await GetAdminUsersByRole('CONTENT_REVIEWER')
      const reviewers = reviewersResponse.data.map((reviewer: AdminUser) => ({
        id: reviewer.id,
        name: reviewer.fullName,
      }))
      setContentReviewers(reviewers)
    } catch (error) {
      console.error('Error fetching admin users:', error)
    }
  }

  useEffect(() => {
    fetchAdminUsers()
  }, [])

  const toggleFilterBox = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilterBox(showFilterBox ? null : event.currentTarget)
  }

  const fetchTutorialContent = async (
    status?: string,
    reviewerId?: string,
    writerId?: string,
  ) => {
    try {
      setLoading(true)
      const filteredSubtopicsResponse = await FilterSubtopics(
        status,
        reviewerId,
        writerId,
      )
      const filteredSubtopics: SubTopic[] = filteredSubtopicsResponse.data
      // Update the tutorialContentData state with the filtered subtopics
      steTutorialContentData(filteredSubtopics)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tutorial content:', error)
    }
  }

  const handleFilterFetch = async () => {
    const selectedWriterId = contentWriters.find(
      (writer) => writer.name === selectedWriter,
    )?.id
    const selectedReviewerId = contentReviewers.find(
      (reviewer) => reviewer.name === selectedReviewer,
    )?.id

    fetchTutorialContent(selectedStatus, selectedReviewerId, selectedWriterId)
  }

  const handleFilterCancel = () => {
    setShowFilterBox(null)
    setSelectedWriter('')
    setSelectedReviewer('')
    setSelectedStatus('')
  }

  const handleFilterReset = async () => {
    setSelectedWriter('')
    setSelectedReviewer('')
    setSelectedStatus('')
    fetchTutorialContent()
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const data = await contentTutorial(page, rowsPerPage)
        steTutorialContentData(data.data)
        setLoading(false)
      } catch (error) {
        return error
      }
    }
    fetchData()
  }, [page, rowsPerPage])

  const label = { inputProps: { 'aria-label': 'Switch demo' } }

  return (
    <BaseLayout title="Tutorial Content">
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
            {role === 'ADMIN' && (
              <IconButton
                onClick={() => navigate(-1)}
                color="inherit"
                size="large"
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h5" component="h5">
              Tutorial Content
            </Typography>
          </Box>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '10px',
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
                  <Tooltip title="Filters for Tutorial Content">
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
                    vertical: 'center',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'center',
                    horizontal: 'center',
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
                      width: 'auto',
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
                      <Grid item sx={{ display: 'flex', gap: 3 }}>
                        {(role === 'ADMIN' || role === 'CONTENT_REVIEWER') && (
                          <Autocomplete
                            freeSolo
                            id="search-content-writers"
                            options={contentWriters.map(
                              (writer) => writer.name,
                            )}
                            value={selectedWriter}
                            onChange={(_event, newValue) =>
                              setSelectedWriter(newValue || '')
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Filter by Content Writer Name"
                              />
                            )}
                            sx={{ width: 280 }}
                          />
                        )}
                        {(role === 'ADMIN' || role === 'CONTENT_WRITER') && (
                          <Autocomplete
                            freeSolo
                            id="search-content-reviewers"
                            options={contentReviewers.map(
                              (reviewer) => reviewer.name,
                            )}
                            value={selectedReviewer}
                            onChange={(_event, newValue) =>
                              setSelectedReviewer(newValue || '')
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Filter by Content Reviewer Name"
                              />
                            )}
                            sx={{ width: 280 }}
                          />
                        )}
                      </Grid>
                      <Grid item>
                        <TextField
                          select
                          label="Filter by Status"
                          value={selectedStatus}
                          onChange={(event) =>
                            setSelectedStatus(event.target.value)
                          }
                          sx={{ width: 180 }}
                        >
                          <MenuItem value="">Select Item</MenuItem>
                          <MenuItem value="CONTENT_ASSIGNED">
                            Content Assigned
                          </MenuItem>
                          <MenuItem value="TO_ASSIGN">To Assign</MenuItem>
                          <MenuItem value="REVIEW_ASSIGNED">
                            Review Assigned
                          </MenuItem>
                          <MenuItem value="CONTENT_DONE">Content Done</MenuItem>
                          <MenuItem value="CHANGES_NEEDED">
                            Changes Needed
                          </MenuItem>
                          <MenuItem value="READY_TO_PUBLISH">
                            Ready To Publish
                          </MenuItem>
                          <MenuItem value="UNPUBLISHED">Unpublished</MenuItem>
                          <MenuItem value="PUBLISHED">Published</MenuItem>
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
                id="search-content"
                options={[]}
                inputValue={searchQuery}
                onInputChange={handleInputChange}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Search Content" />
                )}
              />

              <Button
                variant="contained"
                onClick={() =>
                  navigate('/tutorial-content/assign-tutorial-content')
                }
              >
                Assign Tutorial Content
              </Button>
            </div>
          </div>
        </Box>
      </Box>
      <Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 550 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
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
                        style={{ maxWidth: column.maxWidth }}
                      >
                        <p style={{ fontSize: 14, fontWeight: 505 }}>
                          {column.label}
                        </p>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tutorialContentData.length > 0 &&
                    tutorialContentData.map((row: tutorial, index: number) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                      >
                        <TableCell align="left">
                          {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="left">
                          <Link to={'/tutorial-content/subtopic-write-content'}>
                            {row.subTopicName}
                          </Link>
                        </TableCell>
                        <TableCell align="center">
                          {row.topicInfo.topicName}
                        </TableCell>
                        <TableCell align="center">
                          {row.tutorialInfo.tutorialName}
                        </TableCell>
                        <TableCell align="center">
                          {row.writerInfo ? 'row.writerInfo ' : 'Not Assigned'}
                        </TableCell>
                        <TableCell align="center">
                          {row.reviewerInfo
                            ? 'row.reviewerInfo'
                            : 'Not Assigned'}
                        </TableCell>
                        <TableCell align="center">{row.status}</TableCell>
                        <TableCell align="center">
                          {<Switch {...label} />}
                        </TableCell>
                      </TableRow>
                    ))}
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
                onClick={() => setPage(() => (page == 0 ? 1 : page - 1))}
                disabled={page === 1}
              >
                <ArrowBackIosIcon sx={{ fontSize: 17, fontWeight: 900 }} />
              </IconButton>
              <IconButton
                onClick={() => setPage(() => (page == 0 ? 1 : page + 1))}
                disabled={tutorialContentData.length < rowsPerPage}
              >
                <ArrowForwardIosIcon sx={{ fontSize: 17, fontWeight: 900 }} />
                <span style={{ fontSize: 16 }}>{page == 0 ? 1 : page}</span>
              </IconButton>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </BaseLayout>
  )
}

export default TutorialContent
