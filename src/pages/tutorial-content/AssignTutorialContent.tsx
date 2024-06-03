/* eslint-disable no-console */
import { BaseLayout } from '../../components/BaseLayout'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Key, useEffect, useState } from 'react'
import {
  assignContentWritter,
  getAdminBYRoll,
  getTutorialDetail,
  searchTutorial,
} from '../../api/tutorialContentAPI'
import SnackbarComponent from '../../components/SnackBar'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useDebounce } from '../../hooks/useDebounce'

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
  const navigate = useNavigate()

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
  const [selectedSubTopic, setSelectedSubTopic] = useState('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const handleSearch = (searchQuery: string) => {
    setSearchQuery(searchQuery)
  }

  useEffect(() => {
    if (debouncedSearchQuery) {
      const fetchData = async () => {
        try {
          const response = await searchTutorial(debouncedSearchQuery)
          setResults(response.data)
        } catch (error) {
          alert(error)
        }
      }
      fetchData()
    }
  }, [debouncedSearchQuery])

  useEffect(() => {
    if (selectedValue?.id) {
      const getGroupedValue = async () => {
        try {
          const data = await getTutorialDetail(selectedValue?.id)
          setTutorialDetail(data.data)
          if (
            data.data.topics.length === 0 ||
            data.data.topics.every(
              (topic: { subTopics: string }) => topic.subTopics.length === 0,
            )
          ) {
            setErrorMsg('There are no topics in the selected tutorial')
          }
        } catch (error) {
          console.error('Error fetching tutorial details:', error)
          setErrorMsg('Failed to fetch tutorial details')
        }
      }
      getGroupedValue()
    }
  }, [selectedValue])

  useEffect(() => {
    if (searchQuery) {
      if (results.length > 0) {
        const options = results.map((e) => ({
          label: e.tutorialName,
          id: e.id,
        }))
        setOptions(options)
      } else {
        setOptions([])
      }
    } else {
      setOptions([])
    }
  }, [searchQuery, results])

  const handleAdmin = async () => {
    try {
      const response = await getAdminBYRoll()
      setAllAdminData(response.data)
    } catch (error) {
      console.error('Error fetching admins:', error)
    }
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
    setErrorMsg('')
    if (typeof value === 'string') {
      setSelectedValue({ label: value, id: value })
    } else {
      setSelectedValue(value)
    }
  }

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
      callWritterApi(selectedAdmin)
    }
  }

  const [adminOptions, setAdminOptions] = useState<
    { label: string; id: string }[]
  >([])
  const [adminInputValue, setAdminInputValue] = useState('')

  const formatRole = (role: string) => {
    return role
      .toLowerCase()
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const filterAdmins = (query: string) => {
    if (query) {
      const filteredAdmins = allAdminData.filter(
        (admin) =>
          admin.fullName.toLowerCase().includes(query.toLowerCase()) ||
          admin.role.toLowerCase().includes(query.toLowerCase()),
      )
      const contentWritersAndAdmins = filteredAdmins.filter(
        (admin) => admin.role === 'CONTENT_WRITER' || admin.role === 'ADMIN',
      )
      const options = contentWritersAndAdmins.map((admin) => ({
        label: `${admin.fullName} - ${formatRole(admin.role)}`,
        id: admin.id,
      }))
      setAdminOptions(options)
    } else {
      setAdminOptions([])
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconButton onClick={() => navigate(-1)} color="inherit" size="large">
            <ArrowBackIcon />
          </IconButton> 
          <Typography variant="h5" component="h5">
            Assign Tutorial Content
          </Typography>
        </Box>

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
          <InputLabel htmlFor="grouped-native-select">
            Select Sub-Topic
          </InputLabel>
          <Select
            native
            defaultValue=""
            value={selectedSubTopic || ''}
            onFocus={() => {
              if (
                !selectedSubTopic &&
                tutorialDetail &&
                tutorialDetail.topics?.length > 0
              ) {
                setSelectedSubTopic(' ')
              }
            }}
            id="grouped-native-select"
            label="Grouping"
            onChange={(e) => handleSelectedSubTopic(e.target.value)}
          >
            <option aria-label="" value="Selct item" />
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
          <Autocomplete
            id="search-Admin"
            options={adminOptions}
            onInputChange={(_e, value) => {
              setAdminInputValue(value)
              filterAdmins(value)
            }}
            onChange={(_e, value) => {
              if (typeof value === 'string') {
                setSelectedAdmin(value)
              } else if (value) {
                setSelectedAdmin(value.id)
              } else {
                setSelectedAdmin('')
              }
            }}
            inputValue={adminInputValue}
            renderInput={(params) => (
              <TextField {...params} label="Search Content Writer Name" />
            )}
          />
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
