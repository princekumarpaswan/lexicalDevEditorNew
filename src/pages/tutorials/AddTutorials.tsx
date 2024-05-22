/* eslint-disable no-console */
import React, { useState, useEffect, useContext } from 'react'
import { BaseLayout } from '../../components/BaseLayout'
import { Box, Button, TextField, Theme, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useNavigate } from 'react-router-dom'
import {
  TutorialContext,
  TutorialProvider,
} from '../../context/TutorialContext/TutorialContext'
import { getAllCategories, createTutorial } from '../../api/tutorialAPI'

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

interface Category {
  name: string
  id: number
  categoryName: string
}

function getStyles(
  name: string,
  selectedCategories: readonly string[],
  theme: Theme,
) {
  return {
    fontWeight:
      selectedCategories.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

function AddTutorials() {
  const navigate = useNavigate()
  const theme = useTheme()
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(
    [],
  )
  const [tutorialTitle, setTutorialTitle] = useState('')
  const [tutorialDescription, setTutorialDescription] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const { setTutorialId } = useContext(TutorialContext)
  const { setTutorialName } = useContext(TutorialContext)

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

  const handleChange = (
    event: SelectChangeEvent<typeof selectedCategories>,
  ) => {
    const {
      target: { value },
    } = event
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value)
  }

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
      console.log('Tutorial ID set in context:', newTutorialId)
      // console.log('Tutorial ID set in context:', newTutorialName)

      navigate(`/tutorials/add-tutorial/topic-and-subtopic`, {
        state: { tutorialId: newTutorialId, newTutorialName: newTutorialName },
      })
    } catch (error) {
      console.error('Error creating tutorial:', error)
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
            <Typography variant="h5" component="h5" pb={1}>
              Add Tutorial
            </Typography>
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
              <Select
                displayEmpty
                value={selectedCategories}
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
    </TutorialProvider>
  )
}

export default AddTutorials
