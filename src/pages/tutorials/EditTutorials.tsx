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
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useEffect, useState } from 'react'
import { getAllCategories } from '../../api/categoryAPI'
import theme from '../../components/Editor/theme'
import {
  createSubTopicInfo,
  createTopicInfo,
  deleteSubTopicInfo,
  deleteTopicInfo,
  getTutorialDetails,
  updateSubTopicInfo,
  updateTopicInfo,
  updateTutorialInfo,
} from '../../api/tutorialAPI'
import { useParams } from 'react-router-dom'
import SnackbarComponent from '../../components/SnackBar'
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
        const response = await getTutorialDetails(tutorialId)
        const { data } = response

        setTutorialTitle(data.tutorialName)
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
      setErrorMsg('Something Went Wrong')
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
        if (topicToDelete.subTopics.length > 0) {
          alert('Please delete all sub-topics before deleting the topic.')
          return
        }

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
      setErrorMsg('Something Went Wrong')
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h5" component="h5" pb={1}>
            Edit Tutorial information
          </Typography>
          {/* <Button variant="contained" sx={{ backgroundColor: 'darkred' }}>
            Delete Tutorial
          </Button> */}
        </Box>
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
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
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
        <Typography variant="h5" component="h5" pb={1}>
          Edit Topic and Sub-topic information
        </Typography>

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
              <TextField
                label="Topic Name"
                value={topic.topicName || ''}
                onChange={(e) =>
                  handleTopicNameChange(topicIndex, e.target.value)
                }
                fullWidth
                sx={{ marginTop: 2 }}
              />
              <TextField
                label="Topic Description"
                sx={{ marginTop: 1.5 }}
                value={topic.topicDescription || ''}
                onChange={(e) =>
                  handleTopicDescriptionChange(topicIndex, e.target.value)
                }
                fullWidth
              />
              <Box
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleUpdateTopicInfo(topicIndex)}
                  disabled={!topicChanges[topicIndex]}
                >
                  {topic.topicId ? 'Update Topic Info' : 'Create Topic Info'}
                </Button>
              </Box>
              {topic.subTopics &&
                topic.subTopics.length > 0 &&
                topic.subTopics.map((subTopic, subTopicIndex) => (
                  <Box
                    key={subTopicIndex}
                    ml={4}
                    mt={subTopicIndex !== 0 ? 3 : 1}
                    mb={subTopicIndex === topic.subTopics.length - 1 ? 1 : 1}
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
                        <TextField
                          label="Sub-Topic Description"
                          multiline
                          sx={{ marginTop: 0.8 }}
                          value={subTopic.subTopicDescription}
                          onChange={(e) =>
                            handleSubTopicDescriptionChange(
                              topicIndex,
                              subTopicIndex,
                              e.target.value,
                            )
                          }
                          fullWidth
                        />
                      </Box>

                      <DeleteIcon
                        aria-label="delete"
                        onClick={() =>
                          handleDeleteSubTopic(topicIndex, subTopicIndex)
                        }
                        sx={{ color: 'red', cursor: 'pointer' }}
                      />
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
                          handleUpdateSubTopicInfo(topicIndex, subTopicIndex)
                        }
                        sx={{ mt: 2 }}
                        disabled={!subTopicChanges[topicIndex][subTopicIndex]}
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
