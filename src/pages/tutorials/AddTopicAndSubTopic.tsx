import React, { useState } from 'react'
import { BaseLayout } from '../../components/BaseLayout'
import { Box, Button, Typography, TextField, Modal, Input } from '@mui/material'

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
  // State variables for modal
  const [openModal, setOpenModal] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [fileInput, setFileInput] = useState<File | null>(null)

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
      setFileInput(files[0])
    }
  }
  const handleGenerate = () => {
    // You can use the textInput and fileInput states here
    // console.log('Text Input:', textInput)
    // console.log('File Input:', fileInput)

    // Close the modal after generating content
    handleCloseModal()
  }

  const [topics, setTopics] = useState<Topic[]>([
    {
      topicName: '',
      topicDescription: '',
      subTopics: [{ subTopicName: '', subTopicDescription: '' }],
    },
  ])

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
              label="Text Input"
              fullWidth
              value={textInput}
              onChange={handleTextInputChange}
              sx={{ marginBottom: 2 }}
            />

            {/* File input */}
            <Input
              sx={{ marginTop: 5}}
              type="file"
              onChange={handleFileInputChange}
            />
            {/* Buttons */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleGenerate}>
                Generate
              </Button>
            </Box>
          </Box>
        </Modal>
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
            <Typography variant="h5" component="h5" pb={1}>
              Topic {topicIndex + 1}
            </Typography>
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
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={() => handleAddSubTopic(topicIndex)}
              sx={{ float: 'right' }}
            >
              Add Sub-Topic
            </Button>
          </Box>
        ))}
        <Box>
          <Button variant="contained" onClick={handleAddTopic}>
            Add Topic
          </Button>
        </Box>
        <Button variant="contained">Submit</Button>
      </Box>
    </BaseLayout>
  )
}

export default AddTopicAndSubTopic
