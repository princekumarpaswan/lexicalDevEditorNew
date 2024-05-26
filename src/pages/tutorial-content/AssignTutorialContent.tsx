import { BaseLayout } from '../../components/BaseLayout'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Key, useEffect, useState } from 'react'
import {
  // contentReviewer,
  assignContentWritter,
  getAdminBYRoll,
  getTutorialDetail,
  searchTutorial,
} from '../../api/tutorialContentAPI'
import SnackbarComponent from '../../components/SnackBar'

interface Tutorial {
  id: string
  tutorialName: string
}

interface TutorialDetail {
  topics: {
    id: Key | null | undefined
    topicName: string
    subTopics: { subTopicId: string; subTopicName: string }[]
  }[]
}

interface Admin {
  id: string
  fullName: string
  role: string
  email: string
}

function AssignTutorialContent() {
  const [results, setResults] = useState<Tutorial[]>([])
  const [allAdminData, setAllAdminData] = useState<Admin[]>([])
  const [options, setOptions] = useState<{ label: string; id: string }[]>([])
  const [subTopicId, setSubTopicId] = useState<string>('')
  const [selectedAdmin, setSelectedAdmin] = useState<string | undefined>('')
  const [selectedValue, setSelectedValue] = useState<{
    id: string
    label: string
  } | null>()
  const [tutorialDetail, setTutorialDetail] = useState<
    TutorialDetail | undefined
  >()
  // const getrole = useContext(AuthContext)
  // const data = getrole?.state?.user?.role
  const [selectedSubTopic, setSelectedSubTopic] = useState('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery) {
      try {
        const response = await searchTutorial(searchQuery)
        setResults(response.data)
      } catch (error) {
        alert(error)
      }
    } else {
      setResults([])
    }
  }

  useEffect(() => {
    if (selectedValue?.id) {
      const getGroupedValue = async () => {
        const data = await getTutorialDetail(selectedValue?.id)
        setTutorialDetail(data.data)
      }
      getGroupedValue()
    }
  }, [selectedValue])

  useEffect(() => {
    if (results.length > 0) {
      const options = results.map((e) => ({ label: e.tutorialName, id: e.id }))
      setOptions(options)
    }
  }, [results])

  const handleAdmin = async () => {
    const response = await getAdminBYRoll()
    setAllAdminData(response.data)
  }

  const handleSelectedAdmin = (value: string) => {
    setSelectedAdmin(value)
  }

  const handleSelectedSubTopic = (e: string) => {
    setSelectedSubTopic(e)
  }

  useEffect(() => {
    const data = selectedSubTopic.split(' ').splice(-1)
    if (data) {
      setSubTopicId(data[0])
    }
  }, [selectedSubTopic])

  useEffect(() => {
    handleAdmin()
  }, [])

  const handleSelectedValue = (
    value: string | { label: string; id: string } | null,
  ) => {
    if (typeof value === 'string') {
      setSelectedValue({ label: value, id: value })
    } else {
      setSelectedValue(value)
    }
  }

  // const callReviewerApi = async (id: string) => {
  //   await contentReviewer(subTopicId, id)
  // }

  const callWritterApi = async (id: string) => {
    setIsLoading(true)
    await assignContentWritter(subTopicId, id)

    setSnackbarOpen(true)
    setSnackbarMessage('Content Assigned Successfully')
    setIsLoading(false)
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (selectedAdmin && selectedSubTopic && selectedValue?.label) {
      const data = selectedAdmin.split(' ')
      const userDetail = data.splice(-2)
      callWritterApi(userDetail[1])
    }
  }

  return (
    <BaseLayout title="Assign Tutorial Content">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          '& > :not(style)': { width: '50%', my: 1 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        autoComplete="off"
      >
        <Typography variant="h5" component="h5" pb={1}>
          Assign Tutorial Content
        </Typography>

        <FormControl fullWidth>
          <Autocomplete
            freeSolo
            id="search-Tutorial"
            options={options}
            onChange={(_e, value) => handleSelectedValue(value)}
            renderInput={(params) => (
              <TextField
                onChange={(e) => handleSearch(e.target.value)}
                {...params}
                label="Search Tutorial Name"
              />
            )}
          />
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-native-select">Grouping</InputLabel>
          <Select
            native
            defaultValue=""
            id="grouped-native-select"
            label="Grouping"
            onChange={(e) => handleSelectedSubTopic(e.target.value)}
          >
            {tutorialDetail?.topics?.map((topic) => (
              <optgroup label={topic?.topicName} key={topic.id}>
                {topic?.subTopics?.map((subTopic) => (
                  <option
                    value={`${subTopic.subTopicName} ${subTopic.subTopicId}`}
                    key={subTopic.subTopicId}
                  >
                    {subTopic.subTopicName}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="content-writer-select-label">
            Select Content Writer
          </InputLabel>
          <Select
            id="Select Content Writer"
            value={selectedAdmin || ''}
            label="Select Content Writer"
            onChange={(e) => handleSelectedAdmin(e.target.value)}
          >
            {allAdminData?.map(
              (admin) =>
                admin.role !== 'CONTENT_REVIEWER' && (
                  <MenuItem
                    value={`${admin.fullName} ${admin.role} ${admin.id}`}
                    key={admin.id}
                  >
                    {`${admin.fullName} - ${admin.role}`}
                  </MenuItem>
                ),
            )}
          </Select>
        </FormControl>

        <Button
          onClick={(e) => handleSubmit(e)}
          variant="contained"
          sx={{ mt: 2 }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: '#fff' }} />
          ) : (
            'Assign Content'
          )}
        </Button>
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

export default AssignTutorialContent
