import { BaseLayout } from '../../components/BaseLayout'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { Key, SetStateAction, useContext, useEffect, useState } from 'react'
import {
  contentReviewer,
  contentWritter,
  getAdminBYRoll,
  getTutorialDetail,
  searchTutorial,
} from '../../api/tutorialContentAPI'
import { AuthContext } from '../../context/AuthContext/AuthContext'

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
  const getrole = useContext(AuthContext)
  const data = getrole?.state?.user?.role
  const [selectedSubTopic, setSelectedSubTopic] = useState('')

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

  const handleSelectedAdmin = (e: SetStateAction<string | undefined>) => {
    setSelectedAdmin(e)
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

  const callReviewerApi = async (id: string) => {
    await contentReviewer(subTopicId, id)
  }

  const callWritterApi = async (id: string) => {
    await contentWritter(subTopicId, id)
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (selectedAdmin && selectedSubTopic && selectedValue?.label) {
      const data = selectedAdmin?.split(' ')
      const userDetail = data?.splice(-2)
      if (userDetail && userDetail[0] === 'CONTENT_REVIEWER') {
        callReviewerApi(userDetail[1])
      } else if (userDetail && userDetail[0] === 'CONTENT_WRITER') {
        callWritterApi(userDetail[1])
      }
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
            id="search-category"
            options={options}
            onChange={(e, value) => handleSelectedValue(value)}
            renderInput={(params) => (
              <TextField
                onChange={(e) => handleSearch(e.target.value)}
                {...params}
                label="Search Category"
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
            native
            defaultValue=""
            id="Select Content Writer"
            label="Select Content Writer"
            onChange={(e) => handleSelectedAdmin(e.target.value)}
          >
            {allAdminData?.map((admin) => (
              <>
                {admin.role === data ? null : (
                  <option
                    value={`${admin.fullName}  ${admin.role} ${admin.id}`}
                    key={admin.role}
                  >
                    {data === admin.role
                      ? null
                      : `${admin.fullName} - ${admin.role}`}
                  </option>
                )}
              </>
            ))}
          </Select>
        </FormControl>

        <Button
          onClick={(e) => handleSubmit(e)}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Assign
        </Button>
      </Box>
    </BaseLayout>
  )
}

export default AssignTutorialContent
