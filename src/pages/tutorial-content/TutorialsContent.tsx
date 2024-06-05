/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  Autocomplete,
  Box,
  Button,
  Chip,
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
  useTheme,
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
  updateSubtopicStatus,
} from '../../api/tutorialContentAPI'
import { BaseLayout } from '../../components/BaseLayout'
import { AuthContext } from '../../context/AuthContext/AuthContext'
import { FilterAlt } from '@mui/icons-material'
import { CircularProgress } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { useDebounce } from '../../hooks/useDebounce'
import { ThemeContext } from '../../ThemeContext'
// import { IThemeMode } from '../../ThemeContext/types'

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
  reviewerInfo: { id: string; fullName: string }
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
  writerInfo: { id: string; fullName: string }
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
  const theme = useTheme()
  const navigate = useNavigate()
  const { state } = useContext(AuthContext)
  const role = state.user?.role

  const themeContext = useContext(ThemeContext)

  if (!themeContext) {
    throw new Error('YourComponent must be used within a ThemeContextProvider')
  }

  // const { themeMode } = themeContext

  // const linkStyle = {
  //   color: themeMode === IThemeMode.DARK ? 'lightblue' : 'darkblue',
  // }

  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showFilterBox, setShowFilterBox] = useState<null | HTMLElement>(null)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [tutorialContentData, steTutorialContentData] = useState<tutorial[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [isLoading, setLoading] = useState(true)
  const [updatedSubtopics, setUpdatedSubtopics] = useState<tutorial[]>([])
  //
  //
  //
  const [contentWriters, setContentWriters] = useState<AdminUser[]>([])
  const [contentReviewers, setContentReviewers] = useState<AdminUser[]>([])
  const [writerInputValue, setWriterInputValue] = useState('')
  const [filteredWriters, setFilteredWriters] = useState<any[]>([])
  const [reviewerInputValue, setReviewerInputValue] = useState('')
  const [filteredReviewers, setFilteredReviewers] = useState<any[]>([])
  // const [selectedWriter, setSelectedWriter] = useState<string>('')
  // const [selectedReviewer, setSelectedReviewer] = useState<string>('')

  // const [contentWriters, setContentWriters] = useState<
  //   { id: string; name: string }[]
  // >([])
  // const [contentReviewers, setContentReviewers] = useState<
  //   { id: string; name: string }[]
  // >([])

  // const [filteredWriters, setFilteredWriters] = useState<
  //   { id: string; name: string }[]
  // >([])
  // const [filteredReviewers, setFilteredReviewers] = useState<
  //   { id: string; name: string }[]
  // >([])

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const writersResponse = await GetAdminUsersByRole('CONTENT_WRITER')
        const reviewersResponse = await GetAdminUsersByRole('CONTENT_REVIEWER')
        const writers = writersResponse.data
        const reviewers = reviewersResponse.data
        console.log('Reviewers:', reviewers)
        setContentWriters(writers)
        setContentReviewers(reviewers)
      } catch (error) {
        console.error('Error fetching admin users:', error)
      }
    }

    fetchAdminUsers()
  }, [])

  useEffect(() => {
    if (writerInputValue.trim() === '') {
      setFilteredWriters([])
    } else {
      const filtered = contentWriters.filter((writer) =>
        writer.fullName.toLowerCase().includes(writerInputValue.toLowerCase()),
      )
      setFilteredWriters(filtered.map((writer) => writer.fullName))
    }
  }, [writerInputValue, contentWriters])

  useEffect(() => {
    if (reviewerInputValue.trim() === '') {
      setFilteredReviewers([])
    } else {
      const filtered = contentReviewers.filter((reviewer) =>
        reviewer.fullName
          .toLowerCase()
          .includes(reviewerInputValue.toLowerCase()),
      )
      setFilteredReviewers(filtered.map((reviewer) => reviewer.fullName))
    }
  }, [reviewerInputValue, contentReviewers])
  ///
  ///
  //

  // const fetchAdminUsers = async () => {
  //   try {
  //     const writersResponse = await GetAdminUsersByRole('CONTENT_WRITER')
  //     const writers = writersResponse.data.map((writer: AdminUser) => ({
  //       id: writer.id,
  //       name: writer.fullName,
  //     }))
  //     setContentWriters(writers)

  //     const reviewersResponse = await GetAdminUsersByRole('CONTENT_REVIEWER')
  //     const reviewers = reviewersResponse.data.map((reviewer: AdminUser) => ({
  //       id: reviewer.id,
  //       name: reviewer.fullName,
  //     }))
  //     setContentReviewers(reviewers)
  //   } catch (error) {
  //     console.error('Error fetching admin users:', error)
  //   }
  // }

  // useEffect(() => {
  //   fetchAdminUsers()
  // }, [])

  const handleSubtopicStatusChange = async (id: string, status: string) => {
    try {
      let newStatus: string
      switch (status) {
        case 'PUBLISHED':
          newStatus = 'NOT_PUBLISHED'
          break
        case 'NOT_PUBLISHED':
          newStatus = 'PUBLISHED'
          break
        case 'READY_TO_PUBLISH':
          newStatus = 'PUBLISHED'
          break
        default:
          return // Do nothing for other statuses
      }

      await updateSubtopicStatus(id, newStatus)
      // Update the subtopic status in the local state
      const updatedSubtopics = tutorialContentData.map((subtopic) =>
        subtopic.id === id ? { ...subtopic, status: newStatus } : subtopic,
      )
      setUpdatedSubtopics(updatedSubtopics)
      // You can also update the server data if needed
      steTutorialContentData(updatedSubtopics)
    } catch (error) {
      console.error('Error updating subtopic status:', error)
    }
  }

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

  const toggleFilterBox = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilterBox(showFilterBox ? null : event.currentTarget)
  }

  const fetchTutorialContent = async () => {
    try {
      setLoading(true)
      const params: { [key: string]: string | undefined } = {}

      const selectedWriterId = contentWriters.find(
        (writer) => writer.fullName === writerInputValue,
      )?.id
      const selectedReviewerId = contentReviewers.find(
        (reviewer) => reviewer.fullName === reviewerInputValue,
      )?.id

      if (selectedStatus) {
        params.status = selectedStatus
      }
      if (selectedReviewerId) {
        params.reviewerId = selectedReviewerId
      }
      if (selectedWriterId) {
        params.writerId = selectedWriterId
      }

      const filteredSubtopicsResponse = await FilterSubtopics(params)
      const filteredSubtopics: SubTopic[] = filteredSubtopicsResponse.data
      steTutorialContentData(filteredSubtopics)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching tutorial content:', error)
    }
  }

  const handleFilterFetch = async () => {
    fetchTutorialContent()
    setShowFilterBox(null)
  }

  const handleFilterReset = async () => {
    setWriterInputValue('')
    setReviewerInputValue('')
    setSelectedStatus('')
    fetchTutorialContent()
    setShowFilterBox(null)
  }

  const handleFilterCancel = () => {
    setShowFilterBox(null)
    setWriterInputValue('')
    setReviewerInputValue('')
    setSelectedStatus('')
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
                            options={filteredWriters}
                            inputValue={writerInputValue}
                            onInputChange={(_event, value) => {
                              setWriterInputValue(value)
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Content Writer"
                                variant="outlined"
                              />
                            )}
                            sx={{ width: 240 }}
                          />
                        )}
                        {/* {(role === 'ADMIN' || role === 'CONTENT_REVIEWER') && (
                          <Autocomplete
                            freeSolo
                            id="search-content-writers"
                            options={filteredWriters.map(
                              (writer) => writer.name,
                            )}
                            value={selectedWriter}
                            onInputChange={async (_event, newInputValue) => {
                              console.log('Writer Input:', newInputValue)
                              if (newInputValue) {
                                const filtered = contentWriters.filter(
                                  (writer) =>
                                    writer.name
                                      .toLowerCase()
                                      .includes(newInputValue.toLowerCase()),
                                )
                                setFilteredWriters(filtered)
                              } else {
                                setFilteredWriters([])
                              }
                            }}
                            onChange={(_event, newValue) =>
                              setSelectedWriter(newValue || '')
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Search Content Writer Name"
                              />
                            )}
                            sx={{ width: 280 }}
                          />
                        )} */}
                        {(role === 'ADMIN' || role === 'CONTENT_WRITER') && (
                          <Autocomplete
                            freeSolo
                            options={filteredReviewers}
                            inputValue={reviewerInputValue}
                            onInputChange={(_event, value) => {
                              setReviewerInputValue(value)
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Content Reviewer"
                                variant="outlined"
                              />
                            )}
                            sx={{ width: 240 }}
                          />
                        )}
                        {/* {(role === 'ADMIN' || role === 'CONTENT_WRITER') && (
                          <Autocomplete
                            freeSolo
                            id="search-content-reviewers"
                            options={filteredReviewers.map(
                              (reviewer) => reviewer.name,
                            )}
                            value={selectedReviewer}
                            onInputChange={async (_event, newInputValue) => {
                              if (newInputValue) {
                                const filtered = contentReviewers.filter(
                                  (reviewer) =>
                                    reviewer.name
                                      .toLowerCase()
                                      .includes(newInputValue.toLowerCase()),
                                )
                                setFilteredReviewers(filtered)
                              } else {
                                setFilteredReviewers([])
                              }
                            }}
                            onChange={(_event, newValue) =>
                              setSelectedReviewer(newValue || '')
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Search Content Reviewer Name"
                              />
                            )}
                            sx={{ width: 280 }}
                          />
                        )} */}
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
                          <MenuItem value="TO_ASSIGN">Not Assigned</MenuItem>
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
                          <MenuItem value="NOT_PUBLISHED">Unpublished</MenuItem>
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

              {role == 'ADMIN' && (
                <Button
                  variant="contained"
                  onClick={() =>
                    navigate('/tutorial-content/assign-tutorial-content')
                  }
                >
                  Assign Tutorial Content
                </Button>
              )}
            </div>
          </div>
        </Box>
      </Box>
      <Box>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer
            sx={{ maxHeight: `calc(100vh - 240px)`, overflowY: 'auto' }}
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
                  {updatedSubtopics.length > 0 ||
                  tutorialContentData.length > 0 ? (
                    (updatedSubtopics.length > 0
                      ? updatedSubtopics
                      : tutorialContentData
                    ).map((row: tutorial, index: number) => (
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
                          <Link
                            to={`/tutorial-content/subtopic-write-content/${row.subTopicName
                              .split(' ')
                              .join('-')}/${row.id}`}
                            style={{ color: theme.palette.primary.dark }}
                          >
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
                          {row.writerInfo
                            ? row.writerInfo.fullName
                            : 'Not Assigned'}
                        </TableCell>
                        <TableCell align="center">
                          {row.reviewerInfo
                            ? row.reviewerInfo.fullName
                            : 'Not Assigned'}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={
                              row.status === 'TO_ASSIGN'
                                ? 'Not Assigned'
                                : row.status === 'CONTENT_ASSIGNED'
                                  ? 'Content Assigned'
                                  : row.status === 'CONTENT_DONE'
                                    ? 'Content Done'
                                    : row.status === 'REVIEW_ASSIGNED'
                                      ? 'Review Assigned'
                                      : row.status === 'CHANGES_NEEDED'
                                        ? 'Changes Needed'
                                        : row.status === 'READY_TO_PUBLISH'
                                          ? 'Ready To Publish'
                                          : row.status === 'PUBLISHED'
                                            ? 'Published'
                                            : row.status === 'NOT_PUBLISHED'
                                              ? 'Unpublished'
                                              : row.status
                            }
                            color={
                              row.status == 'TO_ASSIGN'
                                ? 'secondary'
                                : row.status === 'CONTENT_ASSIGNED'
                                  ? 'default'
                                  : row.status === 'CONTENT_DONE'
                                    ? 'primary'
                                    : row.status === 'REVIEW_ASSIGNED'
                                      ? 'default'
                                      : row.status === 'CHANGES_NEEDED'
                                        ? 'warning'
                                        : row.status === 'READY_TO_PUBLISH'
                                          ? 'info'
                                          : row.status === 'PUBLISHED'
                                            ? 'success'
                                            : row.status === 'NOT_PUBLISHED'
                                              ? 'error'
                                              : 'default'
                            }
                            style={{
                              fontWeight: 'bold',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              width: '180px',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {role === 'ADMIN' ? (
                            <Switch
                              {...label}
                              checked={row.status === 'PUBLISHED'}
                              disabled={
                                row.status !== 'READY_TO_PUBLISH' &&
                                row.status !== 'PUBLISHED' &&
                                row.status !== 'NOT_PUBLISHED'
                              }
                              onChange={() =>
                                handleSubtopicStatusChange(row.id, row.status)
                              }
                            />
                          ) : (
                            <Switch
                              {...label}
                              checked={row.status === 'PUBLISHED'}
                              disabled
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={Columndata.length} align="center">
                        No Content Match the Filter you have applied
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
