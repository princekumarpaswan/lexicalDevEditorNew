/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react'
import { BaseLayout } from '../../components/BaseLayout'
import {
  Box,
  Button,
  Typography,
  TextField,
  Divider,
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'

interface SubTopic {
  subTopicName: string
  subTopicDescription: string
}

interface Topic {
  topicName: string
  topicDescription: string
  subTopics: SubTopic[]
}

interface TutorialData {
  title: string
  description: string
  topics: Topic[]
}
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}
function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

const names = [
  'Artificial Intelligence',
  'Machine Learning',
  'Data Science',
  'Computer Vision',
  'Cybersecurity',
  'Software Engineering',
  'Information Retrieval',
  'Natural Language Processing',
  'Computer Networks',
  'Distributed Systems',
]

const EditTutorial: React.FC = () => {
  const [tutorialData, setTutorialData] = useState<TutorialData>({
    title: '',
    description: '',
    topics: [
      {
        topicName: '',
        topicDescription: '',
        subTopics: [{ subTopicName: '', subTopicDescription: '' }],
      },
    ],
  })

  const [personName, setPersonName] = React.useState<string[]>([])
  const theme = useTheme()

  // Assume you have a function to fetch tutorial data by ID
  const fetchTutorialData = async (_tutorialId: string) => {
    // Make API call to fetch tutorial data
    // Example:
    // const response = await fetch(`/api/tutorials/${tutorialId}`);
    // const data = await response.json();
    // const data = {} // Fetch your tutorial data here
    // setTutorialData(data)
  }

  useEffect(() => {
    // Fetch tutorial data when component mounts
    const tutorialId = 'tutorial_id_here' // Replace 'tutorial_id_here' with actual ID
    fetchTutorialData(tutorialId)
  }, [])

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  const handleSave = () => {
    // Logic to save edited tutorial data
  }

  // const handleAddTopic = () => {
  //   setTutorialData((prevState) => ({
  //     ...prevState,
  //     topics: [
  //       ...prevState.topics,
  //       {
  //         topicName: '',
  //         topicDescription: '',
  //         subTopics: [{ subTopicName: '', subTopicDescription: '' }],
  //       },
  //     ],
  //   }))
  // }

  // const handleAddSubTopic = (index: number) => {
  //   setTutorialData((prevState) => {
  //     const updatedTopics = [...prevState.topics]
  //     updatedTopics[index].subTopics.push({
  //       subTopicName: '',
  //       subTopicDescription: '',
  //     })
  //     return { ...prevState, topics: updatedTopics }
  //   })
  // }

  const handleTopicChange = (
    index: number,
    field: keyof Topic,
    value: string,
  ) => {
    setTutorialData((prevState) => {
      const updatedTopics = [...prevState.topics]
      updatedTopics[index] = { ...updatedTopics[index], [field]: value }
      return { ...prevState, topics: updatedTopics }
    })
  }

  const handleSubTopicChange = (
    topicIndex: number,
    subTopicIndex: number,
    field: keyof SubTopic,
    value: string,
  ) => {
    setTutorialData((prevState) => {
      const updatedTopics = [...prevState.topics]
      updatedTopics[topicIndex].subTopics[subTopicIndex] = {
        ...updatedTopics[topicIndex].subTopics[subTopicIndex],
        [field]: value,
      }
      return { ...prevState, topics: updatedTopics }
    })
  }

  return (
    <BaseLayout title="Edit Tutorial">
      {/* Render tutorial data */}
      <Box
        component="form"
        autoComplete="off"
        sx={{
          '& > :not(style)': { width: '60%', my: 1 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h5" component="h5" pb={1}>
            Edit Tutorial
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            border: 1,
            padding: 4,
            borderRadius: 4,
            borderColor: 'darkgray',
            boxShadow: 0.7,
          }}
        >
          <TextField
            label="Tutorial Title"
            value={tutorialData.title}
            onChange={(e) =>
              setTutorialData({ ...tutorialData, title: e.target.value })
            }
          />
          <TextField
            label="Tutorial Description"
            sx={{ marginTop: 2 }}
            multiline
            rows={4}
            value={tutorialData.description}
            onChange={(e) =>
              setTutorialData({ ...tutorialData, description: e.target.value })
            }
          />
          <FormControl sx={{ width: '100%', marginTop: 2 }}>
            <Select
              displayEmpty
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput />}
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <em>Select Category</em>
                }

                return selected.join(', ')
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem disabled value="">
                <em>Select Category</em>
              </MenuItem>
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, personName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider />
        {/* Render topics and subtopics */}
        {tutorialData.topics.map((topic, topicIndex) => (
          <Box
            key={topicIndex}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              border: 1,
              padding: 4,
              borderRadius: 4,
              borderColor: 'darkgray',
              boxShadow: 0.7,
            }}
          >
            <Typography variant="h6" component="h6" pb={1}>
              Edit Topic {topicIndex + 1}
            </Typography>
            <TextField
              label="Topic Name"
              value={topic.topicName}
              onChange={(e) =>
                handleTopicChange(topicIndex, 'topicName', e.target.value)
              }
            />
            <TextField
              label="Topic Description"
              multiline
              value={topic.topicDescription}
              sx={{ marginTop: 1 }}
              onChange={(e) =>
                handleTopicChange(
                  topicIndex,
                  'topicDescription',
                  e.target.value,
                )
              }
            />
            {/* Render subtopics */}
            {topic.subTopics.map((subTopic, subTopicIndex) => (
              <Box
                key={subTopicIndex}
                ml={4}
                mt={subTopicIndex !== 0 ? 3 : 1}
                mb={subTopicIndex === topic.subTopics.length - 1 ? 1 : 1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Typography variant="subtitle1" component="h6" pb={1}>
                  {subTopicIndex + 1}-
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                  }}
                >
                  <TextField
                    label="Sub-Topic Name"
                    value={subTopic.subTopicName}
                    onChange={(e) =>
                      handleSubTopicChange(
                        topicIndex,
                        subTopicIndex,
                        'subTopicName',
                        e.target.value,
                      )
                    }
                  />
                  <TextField
                    label="Sub-Topic Description"
                    multiline
                    value={subTopic.subTopicDescription}
                    sx={{ marginTop: 0.8 }}
                    onChange={(e) =>
                      handleSubTopicChange(
                        topicIndex,
                        subTopicIndex,
                        'subTopicDescription',
                        e.target.value,
                      )
                    }
                  />
                </Box>
              </Box>
            ))}
          </Box>
        ))}

        <Button variant="contained" onClick={handleSave}>
          Update Tutorial
        </Button>
      </Box>
    </BaseLayout>
  )
}

export default EditTutorial
