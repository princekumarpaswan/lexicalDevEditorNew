/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BaseLayout } from '../../components/BaseLayout'
import {
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  Input,
  CircularProgress,
  Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
// import { TutorialContext } from '../../context/TutorialContext/TutorialContext'
import { createTopicsAndSubTopics } from '../../api/tutorialAPI'
import {
  createTopicsAndSubTopicsAI,
  getTopicsAndSubTopicsAI,
} from '../../api/tutorialContentAPI'

export interface SubTopic {
  subTopicName: string
  subTopicDescription: string
}

export interface Topic {
  topicName: string
  topicDescription: string
  subTopics: SubTopic[]
}

const AddTopicAndSubTopic: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const tutorialId = location.state?.tutorialId
  const tutorialName = location.state?.newTutorialName
  const [loading, setLoading] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([
    {
      topicName: '',
      topicDescription: '',
      subTopics: [{ subTopicName: '', subTopicDescription: '' }],
    },
  ])

  const handleGenerate = async () => {
    setOpenModal(false)
    const payload = {
      tutorialName: tutorialName,
      technologies: textInput.split(',').map((tech) => tech.trim()),
    }

    try {
      setLoading(true)
      const response = await createTopicsAndSubTopicsAI(payload)
      const { id } = response.data

      pollForData(id)
    } catch (error) {
      console.error('Error creating topics and subtopics:', error)
      setLoading(false)
    }
  }

  const pollForData = async (id: string) => {
    try {
      const response = await getTopicsAndSubTopicsAI(id)
      if (response.success) {
        console.log('Response:', response)
        console.log('Response data:', response.data)
        if (Array.isArray(response.data)) {
          const mappedTopics = response.data.map(
            ({ topicId, topicName, topicDescription, subTopics }: any) => ({
              topicId,
              topicName,
              topicDescription,
              subTopics: subTopics.map(
                ({ subTopicId, subTopicName, subTopicDescription }: any) => ({
                  subTopicId,
                  subTopicName,
                  subTopicDescription,
                }),
              ),
            }),
          )
          setTopics(mappedTopics)
          setLoading(false)
        } else {
          console.error('Topics data is not an array:', response.data)
          setTimeout(() => pollForData(id), 30000)
        }
      }
    } catch (error) {
      console.error('Error fetching topics and subtopics:', error)
      setTimeout(() => pollForData(id), 30000)
    }
  }

  useEffect(() => {
    if (!tutorialId) {
      console.error('Tutorial ID is missing.')
      return
    }
    console.log('Tutorial ID:', tutorialId)
    console.log('Tutorial name:', tutorialName)
  }, [tutorialId, tutorialName])

  // State variables for modal
  const [openModal, setOpenModal] = useState(false)
  const [textInput, setTextInput] = useState('')
  // const [fileInput, setFileInput] = useState<File | null>(null)

  // Functions to handle modal open/close and input changes
  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // setFileInput(files[0])
    }
  }

  const handleAddTopic = () => {
    setTopics((prevTopics) => [
      ...prevTopics,
      {
        topicName: '',
        topicDescription: '',
        subTopics: [{ subTopicName: '', subTopicDescription: '' }],
      },
    ])
  }

  const handleAddSubTopic = (index: number) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[index].subTopics.push({
        subTopicName: '',
        subTopicDescription: '',
      })
      return updatedTopics
    })
  }

  const handleTopicChange = (
    index: number,
    field: keyof Topic,
    value: string,
  ) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[index] = { ...updatedTopics[index], [field]: value }
      return updatedTopics
    })
  }

  const handleSubTopicChange = (
    topicIndex: number,
    subTopicIndex: number,
    field: keyof SubTopic,
    value: string,
  ) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[topicIndex].subTopics[subTopicIndex] = {
        ...updatedTopics[topicIndex].subTopics[subTopicIndex],
        [field]: value,
      }
      return updatedTopics
    })
  }

  const handleDeleteTopic = (topicIndex: number) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      const topicToDelete = updatedTopics[topicIndex]

      // Check if the topic has no sub-topics
      if (topicToDelete.subTopics.length === 0) {
        updatedTopics.splice(topicIndex, 1)
      } else {
        alert('Please delete all sub-topics before deleting the topic.')
      }

      return updatedTopics
    })
  }
  const handleDeleteSubTopic = (topicIndex: number, subTopicIndex: number) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[topicIndex].subTopics.splice(subTopicIndex, 1)
      return updatedTopics
    })
  }
  const handleSubmit = async () => {
    if (!tutorialId) {
      console.error('Tutorial ID is missing.')
      return
    }

    const tutorialData = {
      tutorialId,
      topics: topics.map(({ topicName, topicDescription, subTopics }) => ({
        topicName,
        topicDescription,
        subTopics: subTopics.map(({ subTopicName, subTopicDescription }) => ({
          subTopicName,
          subTopicDescription,
        })),
      })),
    }
    console.log(tutorialData)

    try {
      await createTopicsAndSubTopics(tutorialData)
      navigate('/tutorials')
    } catch (error) {
      console.error('Error submitting topics and subtopics:', error)
    }
  }

  return (
    <BaseLayout title="Add Topics and Sub-Topics">
      <Box
        component="form"
        sx={{
          '& > :not(style)': { width: '60%', my: 1 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        autoComplete="off"
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h5" pb={1}>
            Add Topics and Sub-Topics
          </Typography>
          <Button variant="contained" sx={{}} onClick={handleOpenModal}>
            Generate Using AI
          </Button>
        </Box>
        {/* Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-title" variant="h6" component="h2" mb={2}>
              Generate using AI
            </Typography>

            {/* Text input */}
            <TextField
              label="Tutorial Name"
              disabled
              fullWidth
              value={tutorialName}
              onChange={handleTextInputChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Enter Technologies You Want To Include"
              fullWidth
              value={textInput}
              onChange={handleTextInputChange}
              sx={{ marginBottom: 2 }}
            />
            <Typography sx={{ textAlign: 'center' }}> Or</Typography>
            <Divider />
            <Typography id="modal-title" fontSize={11} color={'red'}>
              Note : you can either write a prompt or choose a file to Generate
              the Topics and Sub-topics
            </Typography>
            {/* File input */}
            {/* <Button
              fullWidth
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file <VisuallyHiddenInput type="file" />
            </Button> */}
            <Input
              fullWidth
              sx={{
                marginTop: 5,
                backgroundColor: '#1565c0',
                color: 'white',
                padding: 1,
                borderRadius: 1,
              }}
              type="file"
              onChange={handleFileInputChange}
            />
            <Typography sx={{ fontSize: 13, mt: 1 }}>
              {`Uploda the  Content Index File - ( .pdf only )`}
            </Typography>
            {/* Buttons */}
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 2,
              }}
            >
              <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleGenerate}>
                Generate
              </Button>
            </Box>
          </Box>
        </Modal>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
            <Typography sx={{ fontSize: 15, color: 'gray' }}>
              {`Generating Topics and SubTopics for ${tutorialName}`}
            </Typography>
          </Box>
        ) : (
          <>
            {topics.map((topic, topicIndex) => (
              <Box
                key={topicIndex}
                mt={topicIndex !== 0 ? 2 : 0}
                mb={topicIndex === topics.length - 1 ? 2 : 0}
                sx={{
                  border: 1.7,
                  padding: 2,
                  borderRadius: 4,
                  borderColor: 'darkgray',
                  boxShadow: 0.7,
                  boxSizing: 'border-box',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h5" component="h5" pb={1}>
                    Topic {topicIndex + 1}
                  </Typography>
                  {topicIndex !== 0 && (
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteTopic(topicIndex)}
                    >
                      <Button variant="contained">Delete Topic</Button>
                    </IconButton>
                  )}
                </Box>
                <TextField
                  label="Topic Name"
                  value={topic.topicName}
                  onChange={(e) =>
                    handleTopicChange(topicIndex, 'topicName', e.target.value)
                  }
                  fullWidth
                />
                <TextField
                  label="Topic Description"
                  sx={{ marginTop: 1.5 }}
                  value={topic.topicDescription}
                  onChange={(e) =>
                    handleTopicChange(
                      topicIndex,
                      'topicDescription',
                      e.target.value,
                    )
                  }
                  fullWidth
                />
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
                    <Box sx={{ width: '100%' }}>
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
                        fullWidth
                      />
                      <TextField
                        label="Sub-Topic Description"
                        multiline
                        sx={{ marginTop: 0.4 }}
                        value={subTopic.subTopicDescription}
                        onChange={(e) =>
                          handleSubTopicChange(
                            topicIndex,
                            subTopicIndex,
                            'subTopicDescription',
                            e.target.value,
                          )
                        }
                        fullWidth
                      />
                    </Box>
                    <IconButton
                      aria-label="delete"
                      onClick={() =>
                        handleDeleteSubTopic(topicIndex, subTopicIndex)
                      }
                    >
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="contained"
                  onClick={() => handleAddSubTopic(topicIndex)}
                  sx={{ float: 'right', marginTop: 4 }}
                >
                  Add Sub-Topic
                </Button>
              </Box>
            ))}
          </>
        )}
        {!loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Button variant="contained" onClick={handleAddTopic}>
                Add Topic
              </Button>
            </Box>
            <Button fullWidth variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </BaseLayout>
  )
}

export default AddTopicAndSubTopic
