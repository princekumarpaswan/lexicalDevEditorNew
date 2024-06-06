/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { BaseLayout } from '../../components/BaseLayout'
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Select,
  OutlinedInput,
  Theme,
  Divider,
  SelectChangeEvent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  IconButton,
  Modal,
  Input,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useRef, useState } from 'react'
import { getAllCategories } from '../../api/categoryAPI'
import theme from '../../components/Editor/theme'
import {
  createSubTopicInfo,
  createTopicInfo,
  deleteSubTopicInfo,
  deleteTopicInfo,
  deleteTutorialInfo,
  generateDescription,
  getTutorialDetails,
  updateSubTopicInfo,
  updateTopicInfo,
  updateTutorialInfo,
} from '../../api/tutorialAPI'
import {
  // useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import SnackbarComponent from '../../components/SnackBar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  createTopicsAndSubTopicsAI,
  createTopicsAndSubTopicsFileUploadAI,
  getTopicsAndSubTopicsAI,
  uploadFile,
} from '../../api/tutorialContentAPI'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
// import { accessToken } from '../../constants/ApiConstant'

const getAccessToken = (): string => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    throw new Error('Access token not found')
  }
  return token
}

export interface SubTopic {
  subTopicId: string
  subTopicName: string
  subTopicDescription: string
}

export interface Topic {
  topicId: string
  topicName: string
  topicDescription: string
  subTopics: SubTopic[]
}

interface Category {
  name: string
  id: number
  categoryName: string
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

function getStyles(
  name: string,
  selectedCategories: readonly string[],
  theme: Theme,
) {
  return {
    fontWeight:
      selectedCategories && selectedCategories.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

function EditTutorials() {
  const navigate = useNavigate()
  const { tutorialId = '' } = useParams<{ tutorialId: string }>()
  const [topics, setTopics] = useState<Topic[]>([
    {
      topicId: '',
      topicName: '',
      topicDescription: '',
      subTopics: [
        {
          subTopicId: '',
          subTopicName: '',
          subTopicDescription: '',
        },
      ],
    },
  ])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [tutorialTitle, setTutorialTitle] = useState('')
  const [tutorialName, setTutorialName] = useState('')
  const [tutorialDescription, setTutorialDescription] = useState('')
  const [fetchTrigger, setFetchTrigger] = useState(0)

  //states for disabling the  update and create buttons until there is a change in the text fileds
  const [tutorialChanges, setTutorialChanges] = useState(false)
  const [topicChanges, setTopicChanges] = useState(topics.map(() => false))
  const [subTopicChanges, setSubTopicChanges] = useState(
    topics.map((topic) => topic.subTopics.map(() => false)),
  )
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setLoading] = useState(true)
  const [openModal, setOpenModal] = useState(false)

  const [openDeleteTutorialModal, setOpenDeleteTutorialModal] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [fileInput, setFileInput] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [topicDescriptionLoading, setTopicDescriptionLoading] = useState<
    boolean[]
  >([])
  const [subTopicDescriptionLoading, setSubTopicDescriptionLoading] = useState<
    boolean[][]
  >(topics.map(() => []))
  // const location = useLocation()
  // const tutorialName = location.state?.newTutorialName

  const handleGenerateDescription = async (
    topicIndex: number,
    subTopicIndex: number | null,
  ) => {
    try {
      if (subTopicIndex !== null) {
        setSubTopicDescriptionLoading((prevLoading) => {
          const newLoading = [...prevLoading]
          newLoading[topicIndex] = prevLoading[topicIndex]
            ? [...prevLoading[topicIndex]]
            : []
          newLoading[topicIndex][subTopicIndex] = true
          return newLoading
        })
      } else {
        setTopicDescriptionLoading((prevLoading) => {
          const newLoading = [...prevLoading]
          newLoading[topicIndex] = true
          return newLoading
        })
      }

      const name =
        subTopicIndex !== null
          ? topics[topicIndex].subTopics[subTopicIndex].subTopicName
          : topics[topicIndex].topicName

      const response = await generateDescription(name)
      const description = response.data.description
      setSnackbarOpen(true)
      setSnackbarMessage('Description Generated Successfully')

      setTopics((prevTopics) => {
        const updatedTopics = [...prevTopics]

        if (subTopicIndex !== null) {
          updatedTopics[topicIndex].subTopics[subTopicIndex] = {
            ...updatedTopics[topicIndex].subTopics[subTopicIndex],
            subTopicDescription: description,
          }
          setSubTopicDescriptionLoading((prevLoading) => {
            const newLoading = [...prevLoading]
            newLoading[topicIndex] = [...prevLoading[topicIndex]]
            newLoading[topicIndex][subTopicIndex] = false
            return newLoading
          })
        } else {
          updatedTopics[topicIndex] = {
            ...updatedTopics[topicIndex],
            topicDescription: description,
          }
          setTopicDescriptionLoading((prevLoading) => {
            const newLoading = [...prevLoading]
            newLoading[topicIndex] = false
            return newLoading
          })
        }

        return updatedTopics
      })
    } catch (error) {
      console.error('Error generating description:', error)
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(e.target.value)
    setTextInput(e.target.value)
    setFileInput(null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    fileInputRef.current = e.target
    if (file) {
      // Check file extension
      const allowedExtensions = ['.pdf']
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      if (!allowedExtensions.includes(`.${fileExtension}`)) {
        setFileError('Please select a .pdf file.')
        return
      }

      // Check file size
      const maxSize = 5 * 1024 * 1024 // 5 MB
      if (file.size > maxSize) {
        setFileError('File size exceeds 5 MB limit.')
        return
      }
      setFileError(null)
    }
    if (file) {
      setFileInput(file)
      setTextInput('')
    }
  }

  const handleGenerate = async () => {
    setOpenModal(false)
    setLoading(true)

    try {
      if (textInput.trim()) {
        // Generate topics and subtopics using text input (technologies)
        const payload = {
          tutorialName,
          technologies: textInput.split(',').map((tech) => tech.trim()),
        }
        try {
          const response = await createTopicsAndSubTopicsAI(payload)
          const { id } = response.data
          pollForData(id)
        } catch (error) {
          console.error(
            'Error creating topics and subtopics with text input:',
            error,
          )
          setLoading(false)
          setSnackbarOpen(true)
          setErrorMsg(
            'Error generating Topics and Sub-Topics, Please try again',
          )
        }
      } else {
        // Generate topics and subtopics using file input
        const fileInput = (
          document.querySelector('input[type="file"]') as HTMLInputElement
        )?.files?.[0]
        if (!fileInput) {
          console.error('No file selected.')
          setLoading(false)
          return
        }

        try {
          const fileUploadResponse = await uploadFile(fileInput)
          const fileUploadResponseData = fileUploadResponse.data
          console.log('File upload response:', fileUploadResponseData)

          const createResponse = await createTopicsAndSubTopicsFileUploadAI(
            fileUploadResponseData,
          )
          const { id } = createResponse.data
          console.log('Generated ID:', id)

          pollForData(id)
        } catch (error) {
          console.error(
            'Error creating topics and subtopics with file input:',
            error,
          )
          setLoading(false)
          setSnackbarOpen(true)
          setErrorMsg(
            'Error generating Topics and Sub-Topics, Please try again',
          )
        }
      }
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
        if (response.success && Array.isArray(response.data)) {
          const mappedTopics = response.data.map(
            ({ topicId, topicName, topicDescription, subTopics }: any) => ({
              topicId,
              topicName,
              topicDescription,
              subTopics: subTopics?.map(
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
          setSnackbarOpen(true)
          setSnackbarMessage('Topics and Subtopics Generated Successfully')
        } else {
          setTimeout(() => pollForData(id), 30000)
        }
      }
    } catch (error) {
      setLoading(false)
      console.error('Error Generating topics and subtopics:', error)
      setSnackbarOpen(true)
      setErrorMsg('Error generating Topics and Sub-Topics, Please try again')
    }
  }

  const handleClearTextInput = () => {
    setTextInput('')
  }
  const handleClearFileInput = () => {
    setFileInput(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleResetFeildsInGenerateUsingAiModal = () => {
    handleClearTextInput()
    handleClearFileInput()
  }

  const handleDeleteTutorial = async () => {
    try {
      await deleteTutorialInfo(tutorialId)
      setSnackbarOpen(true)
      setSnackbarMessage('Tutorial Deleted Successfully')
      navigate(`/tutorials`)
    } catch (error) {
      setSnackbarOpen(true)
      setErrorMsg('Cannot delete the Tutorial')
      console.error('Error deleting tutorial:', error)
    }
    setOpenDeleteTutorialModal(false)
  }

  const handleOpenDeleteTutorialMoadal = () => {
    setOpenDeleteTutorialModal(true)
  }
  const handleClose = () => {
    setOpenDeleteTutorialModal(false)
  }

  // const handleChange = (
  //   event: SelectChangeEvent<typeof selectedCategories>,
  // ) => {
  //   const {
  //     target: { value },
  //   } = event
  //   setSelectedCategories(typeof value === 'string' ? value.split(',') : value)
  // }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories()
        const categoriesData = response.data
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData)
        } else {
          console.error('Categories data is not an array:', categoriesData)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchTutorialDetails = async () => {
      try {
        setLoading(true)
        const response = await getTutorialDetails(tutorialId)
        const { data } = response
        setLoading(false)
        setTutorialTitle(data.tutorialName)
        setTutorialName(data.tutorialName)
        setTutorialDescription(data.tutorialDescription)
        setSelectedCategories([data.categoryInfo.categoryName])

        const mappedTopics = data.topics.map(
          (topic: {
            topicId: string
            topicName: any
            topicDescription: any
            subTopics: any[]
          }) => ({
            topicId: topic.topicId,
            topicName: topic.topicName,
            topicDescription: topic.topicDescription,
            subTopics: topic.subTopics.map(
              (subTopic: {
                subTopicId: string
                subTopicName: any
                subTopicDescription: any
              }) => ({
                subTopicId: subTopic.subTopicId,
                subTopicName: subTopic.subTopicName,
                subTopicDescription: subTopic.subTopicDescription,
              }),
            ),
          }),
        )

        setTopics(mappedTopics)
        setSubTopicChanges(
          mappedTopics.map((topic: { subTopics: any[] }) =>
            topic.subTopics.map(() => false),
          ),
        )
        setTutorialChanges(false)
      } catch (error) {
        console.error('Error fetching tutorial details:', error)
      }
    }

    fetchTutorialDetails()
  }, [tutorialId, fetchTrigger])

  const handleSaveTutorialInfo = async () => {
    try {
      if (!tutorialId) {
        console.error('Tutorial ID is missing')
        return
      }

      const selectedCategory = categories.find(
        (category) => category.categoryName === selectedCategories[0],
      )

      const newCategoryId = selectedCategory?.id.toString() || ''

      const updatedTutorialData = await updateTutorialInfo(
        tutorialId,
        tutorialTitle,
        tutorialDescription,
        newCategoryId,
      )
      setFetchTrigger((prevTrigger) => prevTrigger + 1)
      setSnackbarOpen(true)
      setSnackbarMessage('Tutorial Details Updated Successfully')
      console.log('Tutorial info updated:', updatedTutorialData)
    } catch (error) {
      console.error('Error updating tutorial info:', error)
      setSnackbarOpen(true)
      setErrorMsg('Something Went Wrong')
    }
  }

  // const handleUpdateTopicInfo = async (topicIndex: number) => {
  //   try {
  //     const topicToUpdate = topics[topicIndex]
  //     if (!topicToUpdate.topicId) {
  //       console.error('Topic ID is missing')
  //       return
  //     }

  //     const updatedTopic = await updateTopicInfo(accessToken, {
  //       topicId: topicToUpdate.topicId,
  //       newTopicName: topicToUpdate.topicName,
  //       newTopicDescription: topicToUpdate.topicDescription,
  //     })

  //     setTopics((prevTopics) => {
  //       const updatedTopics = [...prevTopics]
  //       updatedTopics[topicIndex] = {
  //         ...updatedTopic,
  //         subTopics: topicToUpdate.subTopics,
  //       }
  //       return updatedTopics
  //     })
  //     setFetchTrigger((prevTrigger) => prevTrigger + 1)
  //   } catch (error) {
  //     console.error('Error updating topic info:', error)
  //   }
  // }
  const handleUpdateTopicInfo = async (topicIndex: number) => {
    try {
      const topicToUpdate = topics[topicIndex]

      if (!topicToUpdate.topicId) {
        const createdTopic = await createTopicInfo(tutorialId, {
          topicName: topicToUpdate.topicName,
          topicDescription: topicToUpdate.topicDescription,
        })

        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics[topicIndex] = {
            ...createdTopic,
            topicId: createdTopic.id,
            subTopics: topicToUpdate.subTopics,
          }
          return updatedTopics
        })
        setSnackbarOpen(true)
        setSnackbarMessage('Topic Created Successfully')
      } else {
        const updatedTopic = await updateTopicInfo({
          topicId: topicToUpdate.topicId,
          newTopicName: topicToUpdate.topicName,
          newTopicDescription: topicToUpdate.topicDescription,
        })

        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics[topicIndex] = {
            ...updatedTopic,
            subTopics: topicToUpdate.subTopics,
          }
          return updatedTopics
        })
        setSnackbarOpen(true)
        setSnackbarMessage('Topic Updated Successfully')
      }
      setFetchTrigger((prevTrigger) => prevTrigger + 1)
      setTopicChanges((prevChanges) => {
        const updatedChanges = [...prevChanges]
        updatedChanges[topicIndex] = false
        return updatedChanges
      })
    } catch (error) {
      console.error('Error updating topic info:', error)
      setSnackbarOpen(true)
      setErrorMsg('Something Went Wrong')
    }
  }

  const handleUpdateSubTopicInfo = async (
    topicIndex: number,
    subTopicIndex: number,
  ) => {
    try {
      const accessToken = getAccessToken()
      const topicToUpdate = topics[topicIndex]
      const subTopicToUpdate = topicToUpdate.subTopics[subTopicIndex]

      if (!subTopicToUpdate.subTopicId) {
        const createdSubTopic = await createSubTopicInfo(
          accessToken,
          topicToUpdate.topicId,
          {
            subTopicName: subTopicToUpdate.subTopicName,
            subTopicDescription: subTopicToUpdate.subTopicDescription,
          },
        )

        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics[topicIndex].subTopics[subTopicIndex] = {
            ...createdSubTopic,
            subTopicId: createdSubTopic.id,
          }
          return updatedTopics
        })
        setSnackbarOpen(true)
        setSnackbarMessage('Sub-Topic Created Successfully')
      } else {
        const updatedSubTopic = await updateSubTopicInfo({
          subTopicId: subTopicToUpdate.subTopicId,
          newSubTopicName: subTopicToUpdate.subTopicName,
          newSubTopicDescription: subTopicToUpdate.subTopicDescription,
        })

        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics[topicIndex].subTopics[subTopicIndex] = updatedSubTopic
          return updatedTopics
        })
        setSnackbarOpen(true)
        setSnackbarMessage('Sub-Topic Updated Successfully')
      }
      setFetchTrigger((prevTrigger) => prevTrigger + 1)
      setSubTopicChanges((prevChanges) => {
        const updatedChanges = [...prevChanges]
        updatedChanges[topicIndex][subTopicIndex] = false
        return updatedChanges
      })
    } catch (error) {
      console.error('Error updating sub-topic info:', error)
      setSnackbarOpen(true)
      setErrorMsg('Something Went Wrong')
    }
  }

  const handleAddTopic = () => {
    setTopics((prevTopics) => [
      ...prevTopics,
      {
        topicId: '',
        topicName: '',
        topicDescription: '',
        subTopics: [],
      },
    ])
    setSubTopicChanges((prevChanges) => [...prevChanges, []])
  }

  const handleAddSubTopic = (index: number) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[index].subTopics.push({
        subTopicName: '',
        subTopicDescription: '',
        subTopicId: '',
      })
      return updatedTopics
    })
    setSubTopicChanges((prevChanges) => {
      const updatedChanges = [...prevChanges]
      updatedChanges[index].push(false)
      return updatedChanges
    })
  }

  const handleDeleteSubTopic = async (
    topicIndex: number,
    subTopicIndex: number,
  ) => {
    try {
      const topicToUpdate = topics[topicIndex]
      const subTopicToDelete = topicToUpdate.subTopics[subTopicIndex]

      if (!subTopicToDelete.subTopicId) {
        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics[topicIndex].subTopics.splice(subTopicIndex, 1)
          return updatedTopics
        })
      } else {
        await deleteSubTopicInfo(subTopicToDelete.subTopicId)

        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics[topicIndex].subTopics.splice(subTopicIndex, 1)
          return updatedTopics
        })
      }
      setSnackbarOpen(true)
      setSnackbarMessage('Sub-Topic Deleted Successfully')
    } catch (error) {
      console.error('Error deleting sub-topic info:', error)
      setSnackbarOpen(true)
      setErrorMsg('Cannot Delete Published Sub- Topic')
    }
  }

  const handleDeleteTopic = async (topicIndex: number) => {
    try {
      const topicToDelete = topics[topicIndex]

      if (!topicToDelete.topicId) {
        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics.splice(topicIndex, 1)
          return updatedTopics
        })
      } else {
        await deleteTopicInfo(topicToDelete.topicId)

        setTopics((prevTopics) => {
          const updatedTopics = [...prevTopics]
          updatedTopics.splice(topicIndex, 1)
          return updatedTopics
        })
      }
      setSnackbarOpen(true)
      setSnackbarMessage('Topic Deleted Successfully')
    } catch (error) {
      console.error('Error deleting topic info:', error)
      setSnackbarOpen(true)
      setErrorMsg(
        'Cannot delete Topic , because some of its Sub-topics are in published state',
      )
    }
  }

  const handleTopicNameChange = (index: number, value: string) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[index].topicName = value
      return updatedTopics
    })
    setTopicChanges((prevChanges) => {
      const updatedChanges = [...prevChanges]
      updatedChanges[index] = true
      return updatedChanges
    })
  }

  const handleTopicDescriptionChange = (index: number, value: string) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[index].topicDescription = value
      return updatedTopics
    })
    setTopicChanges((prevChanges) => {
      const updatedChanges = [...prevChanges]
      updatedChanges[index] = true
      return updatedChanges
    })
  }

  const handleSubTopicNameChange = (
    topicIndex: number,
    subTopicIndex: number,
    value: string,
  ) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[topicIndex].subTopics[subTopicIndex].subTopicName = value
      return updatedTopics
    })
    setSubTopicChanges((prevChanges) => {
      const updatedChanges = [...prevChanges]
      updatedChanges[topicIndex][subTopicIndex] = true
      return updatedChanges
    })
  }

  const handleSubTopicDescriptionChange = (
    topicIndex: number,
    subTopicIndex: number,
    value: string,
  ) => {
    setTopics((prevTopics) => {
      const updatedTopics = [...prevTopics]
      updatedTopics[topicIndex].subTopics[subTopicIndex].subTopicDescription =
        value
      return updatedTopics
    })
    setSubTopicChanges((prevChanges) => {
      const updatedChanges = [...prevChanges]
      updatedChanges[topicIndex][subTopicIndex] = true
      return updatedChanges
    })
  }

  const handleTutorialTitleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTutorialTitle(e.target.value)
    setTutorialChanges(true)
  }

  const handleTutorialDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setTutorialDescription(e.target.value)
    setTutorialChanges(true)
  }

  const handleCategoryChange = (
    event: SelectChangeEvent<typeof selectedCategories>,
  ) => {
    const {
      target: { value },
    } = event
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value)
    setTutorialChanges(true)
  }

  return (
    <BaseLayout title="Edit Tutorial">
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              marginBottom: 6,
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              color="inherit"
              size="large"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" component="h5">
              Edit Tutorial information
            </Typography>
          </Box>
          <DeleteIcon
            aria-label="delete"
            onClick={handleOpenDeleteTutorialMoadal}
            sx={{ color: 'red', cursor: 'pointer', fontSize: 32 }}
          />
        </Box>
        {openDeleteTutorialModal && (
          <Dialog
            open={openDeleteTutorialModal}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {'Delete  Tutorial'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure, you want to delete the whole Tutorial <br />
                <span style={{ color: 'red', fontSize: 13, marginTop: 9 }}>
                  Note: Deleting Tutorial will delete all its respective Topics
                  and Sub-Topics, if none of them are in Published state.
                </span>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                variant="contained"
                onClick={handleDeleteTutorial}
                autoFocus
              >
                Yes, Delete
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 570,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                border: 1,
                padding: 4,
                borderRadius: 4,
                borderColor: 'darkgray',
                boxShadow: 0.7,
              }}
            >
              <TextField
                label="Tutorial Title"
                required
                value={tutorialTitle}
                onChange={handleTutorialTitleChange}
              />

              <TextField
                required
                label="Tutorial Description"
                multiline
                rows={3}
                value={tutorialDescription}
                onChange={handleTutorialDescriptionChange}
              />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <FormControl sx={{ width: '100%' }}>
                  <Select
                    displayEmpty
                    value={selectedCategories}
                    onChange={handleCategoryChange}
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
                    {categories.map((category) => (
                      <MenuItem
                        key={category.id}
                        value={category.categoryName}
                        style={getStyles(
                          category.categoryName,
                          selectedCategories,
                          theme,
                        )}
                      >
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
              >
                <Button
                  variant="contained"
                  onClick={handleSaveTutorialInfo}
                  disabled={!tutorialChanges}
                >
                  Update Tutorial Info
                </Button>
              </Box>
            </Box>
            <Divider />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 3,
                marginBottom: 3,
              }}
            >
              <Typography variant="h5" component="h5" pb={1}>
                Edit Topic and Sub-topic information
              </Typography>
              {/* <Button variant="contained" onClick={handleOpenModal}>
                Generate Using AI
              </Button> */}
            </Box>
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
                <Typography
                  id="modal-title"
                  variant="h6"
                  component="h2"
                  onClick={handleOpenModal}
                >
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
                  disabled={!!fileInput}
                />
                <Typography sx={{ textAlign: 'center' }}> Or</Typography>
                <Divider />
                <Typography id="modal-title" fontSize={11} color={'red'}>
                  Note : you can either write a prompt or choose a file to
                  Generate the Topics and Sub-topics
                </Typography>
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
                  disabled={!!textInput}
                  onChange={handleFileInputChange}
                  inputProps={{
                    accept: '.pdf',
                  }}
                />

                <Typography sx={{ fontSize: 13, mt: 1 }}>
                  {`Uplod the Content Index File - ( .pdf only )`}
                </Typography>
                {fileError && (
                  <Typography sx={{ fontSize: 13, color: 'red', mt: 1 }}>
                    {fileError}
                  </Typography>
                )}
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
                  <Button
                    variant="contained"
                    onClick={handleResetFeildsInGenerateUsingAiModal}
                    sx={{ mr: 2 }}
                  >
                    Reset
                  </Button>
                  <Button variant="contained" onClick={handleGenerate}>
                    Generate
                  </Button>
                </Box>
              </Box>
            </Modal>

            {topics &&
              topics.length > 0 &&
              topics.map((topic, topicIndex) => (
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
                    {topics.length > 1 && (
                      <DeleteIcon
                        aria-label="delete"
                        onClick={() => handleDeleteTopic(topicIndex)}
                        sx={{ color: 'red', cursor: 'pointer' }}
                      />
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Box sx={{ width: '100%' }}>
                      <TextField
                        label="Topic Name"
                        value={topic.topicName || ''}
                        onChange={(e) =>
                          handleTopicNameChange(topicIndex, e.target.value)
                        }
                        fullWidth
                        sx={{ marginTop: 2 }}
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 0.5,
                          alignItems: 'center',
                        }}
                      >
                        <TextField
                          label="Topic Description"
                          sx={{ marginTop: 1.5, width: '90%' }}
                          value={topic.topicDescription || ''}
                          onChange={(e) =>
                            handleTopicDescriptionChange(
                              topicIndex,
                              e.target.value,
                            )
                          }
                          fullWidth
                          multiline
                          InputProps={{
                            endAdornment: topicDescriptionLoading[
                              topicIndex
                            ] ? (
                              <CircularProgress size={24} />
                            ) : null,
                          }}
                        />
                        <IconButton
                          sx={{ color: theme.palette.info.main }}
                          onClick={() =>
                            handleGenerateDescription(topicIndex, null)
                          }
                        >
                          <AutoFixHighIcon fontSize="large" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: 3,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleUpdateTopicInfo(topicIndex)}
                      disabled={!topicChanges[topicIndex]}
                    >
                      {topic.topicId
                        ? 'Update Topic Info'
                        : 'Create Topic Info'}
                    </Button>
                  </Box>
                  {topic.subTopics &&
                    topic.subTopics.length > 0 &&
                    topic.subTopics.map((subTopic, subTopicIndex) => (
                      <Box
                        key={subTopicIndex}
                        ml={4}
                        mt={subTopicIndex !== 0 ? 3 : 1}
                        mb={
                          subTopicIndex === topic.subTopics.length - 1 ? 1 : 1
                        }
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            marginTop: 3,
                          }}
                        >
                          <Typography variant="subtitle1" component="h6" pb={1}>
                            {subTopicIndex + 1}-
                          </Typography>
                          <Box sx={{ width: '100%' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <TextField
                                label="Sub-Topic Name"
                                value={subTopic.subTopicName}
                                onChange={(e) =>
                                  handleSubTopicNameChange(
                                    topicIndex,
                                    subTopicIndex,
                                    e.target.value,
                                  )
                                }
                                fullWidth
                              />
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  handleDeleteSubTopic(
                                    topicIndex,
                                    subTopicIndex,
                                  )
                                }
                              >
                                <DeleteIcon
                                  sx={{ color: theme.palette.error.light }}
                                />
                              </IconButton>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                gap: 0.5,
                                alignItems: 'center',
                              }}
                            >
                              <TextField
                                label="Sub-Topic Description"
                                multiline
                                sx={{ marginTop: 0.8, width: '85%' }}
                                value={subTopic.subTopicDescription}
                                onChange={(e) =>
                                  handleSubTopicDescriptionChange(
                                    topicIndex,
                                    subTopicIndex,
                                    e.target.value,
                                  )
                                }
                                fullWidth
                                InputProps={{
                                  endAdornment: subTopicDescriptionLoading[
                                    topicIndex
                                  ]?.[subTopicIndex] ? (
                                    <CircularProgress size={24} />
                                  ) : null,
                                }}
                              />
                              <IconButton
                                sx={{ color: theme.palette.info.main }}
                                onClick={() =>
                                  handleGenerateDescription(
                                    topicIndex,
                                    subTopicIndex,
                                  )
                                }
                              >
                                <AutoFixHighIcon fontSize="large" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={() =>
                              handleUpdateSubTopicInfo(
                                topicIndex,
                                subTopicIndex,
                              )
                            }
                            sx={{ mt: 2 }}
                            disabled={
                              !subTopicChanges[topicIndex][subTopicIndex]
                            }
                          >
                            {subTopic.subTopicId
                              ? 'Update Sub-Topic'
                              : 'Create Sub-Topic'}
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => handleAddSubTopic(topicIndex)}
                    >
                      Add Sub-Topic
                    </Button>
                  </Box>
                </Box>
              ))}

            <Box>
              <Button variant="contained" onClick={handleAddTopic}>
                Add Topic
              </Button>
            </Box>
          </Box>
        )}
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

export default EditTutorials
