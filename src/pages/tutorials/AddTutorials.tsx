/* eslint-disable no-console */
import React, { useState, useEffect, useContext } from 'react'
import { BaseLayout } from '../../components/BaseLayout'
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  // IconButton,
  TextField,
  // Theme,
  Typography,
} from '@mui/material'
// import { useTheme } from '@mui/material/styles'

import FormControl from '@mui/material/FormControl'
import { useNavigate } from 'react-router-dom'
import {
  TutorialContext,
  TutorialProvider,
} from '../../context/TutorialContext/TutorialContext'
import { getAllCategories, createTutorial } from '../../api/tutorialAPI'
import SnackbarComponent from '../../components/SnackBar'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// }

interface Category {
  name: string
  id: number
  categoryName: string
}

// function getStyles(
//   name: string,
//   selectedCategories: readonly string[],
//   theme: Theme,
// ) {
//   return {
//     fontWeight:
//       selectedCategories.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   }
// }

function AddTutorials() {
  const navigate = useNavigate()
  // const theme = useTheme()
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  )
  const [tutorialTitle, setTutorialTitle] = useState('')
  const [tutorialDescription, setTutorialDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const { setTutorialId } = useContext(TutorialContext)
  const { setTutorialName } = useContext(TutorialContext)

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

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

  const handleSaveTutorial = async () => {
    try {
      // Find the first selected category ID
      const firstSelectedCategoryId = categories.find(
        (category) => category.categoryName === selectedCategories[0],
      )?.id

      if (!firstSelectedCategoryId) {
        console.error('No category selected')
        return
      }

      const tutorialData = {
        tutorialName: tutorialTitle,
        tutorialDescription: tutorialDescription,
        categoryId: firstSelectedCategoryId,
      }

      const newTutorial = await createTutorial(tutorialData)
      const newTutorialId = newTutorial.data.id
      const newTutorialName = newTutorial.data.tutorialName
      setTutorialId(newTutorialId)
      setTutorialName(newTutorialName)
      setSnackbarOpen(true)
      setSnackbarMessage('Tutorial Added Successfuly')
      console.log('Tutorial ID set in context:', newTutorialId)
      // console.log('Tutorial ID set in context:', newTutorialName)

      navigate(`/tutorials/add-tutorial/topic-and-subtopic`, {
        state: { tutorialId: newTutorialId, newTutorialName: newTutorialName },
      })
    } catch (error) {
      console.error('Error creating tutorial:', error)
      setErrorMsg('Something Went Wrong')
      setSnackbarOpen(true)
    }
  }

  // const handleSaveTutorial = async () => {
  //   try {
  //     // Map selected category names to their corresponding IDs
  //     const selectedCategoryIds = selectedCategories.map((name) => {
  //       const selectedCategory = categories.find(
  //         (category) => category.categoryName === name,
  //       )
  //       if (selectedCategory) {
  //         return selectedCategory.id
  //       } else {
  //         console.error(
  //           `Category "${name}" does not exist in the categories array.`,
  //         )
  //         return null
  //       }
  //     })

  //     // Check if any category ID is missing (null)
  //     if (selectedCategoryIds.some((id) => id === null)) {
  //       // Handle the case where a category is missing
  //       // For example, display an error message to the user
  //       return
  //     }

  //     // Proceed with creating the tutorial
  //     const tutorialData = {
  //       title: tutorialTitle,
  //       description: tutorialDescription,
  //       categoryIds: selectedCategoryIds,
  //     }
  //     const newTutorial = await createTutorial(tutorialData)
  //     console.log(newTutorial)

  //     navigate(`/tutorials/add-tutorial/topic-and-subtopic`, {
  //       state: { tutorialId: newTutorial.id },
  //     })
  //   } catch (error) {
  //     console.error('Error creating tutorial:', error)
  //   }
  // }

  return (
    <TutorialProvider>
      <BaseLayout title="Add Tutorial">
        <Box
          component="form"
          sx={{
            '& > :not(style)': { width: '60%', my: 1 },
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
              justifyContent: 'space-between',
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
                Add Tutorial
              </Typography>
            </Box>
          </Box>

          <TextField
            label="Tutorial Title"
            required
            value={tutorialTitle}
            onChange={(e) => setTutorialTitle(e.target.value)}
          />

          <TextField
            required
            label="Tutorial Description"
            multiline
            rows={3}
            value={tutorialDescription}
            onChange={(e) => setTutorialDescription(e.target.value)}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <FormControl sx={{ width: '100%' }}>
              <Autocomplete
                id="categories-autocomplete"
                options={categories.map((category) => category.categoryName)}
                value={selectedCategories[0] || null}
                onChange={(_event, newValue) => {
                  setSelectedCategories(newValue ? [newValue] : [])
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Search Category Name"
                  />
                )}
                filterOptions={(options, params) => {
                  const filtered = options.filter((option) => {
                    return option
                      .toLowerCase()
                      .includes(params.inputValue.toLowerCase())
                  })

                  // Display all options when the input is empty
                  if (params.inputValue === '') {
                    return []
                  }

                  return filtered
                }}
              />
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            width: 100,
            margin: 'auto',
          }}
        >
          <Button
            variant="contained"
            sx={{
              width: 150,
            }}
            onClick={handleSaveTutorial}
          >
            Save Tutorial
          </Button>
        </Box>
      </BaseLayout>
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
    </TutorialProvider>
  )
}

export default AddTutorials
