import { BaseLayout } from '../../components/BaseLayout'
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'
import { useState } from 'react'

function AssignTutorialContent() {
  const [selectedTutorial, setSelectedTutorial] = useState<string>('')
  const [selectedContentWriter, setSelectedContentWriter] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<string>('')

  const handleTutorialChange = (event: SelectChangeEvent<string>) => {
    setSelectedTutorial(event.target.value)
  }

  const handleContentWriterChange = (event: SelectChangeEvent<string>) => {
    setSelectedContentWriter(event.target.value)
  }

  const handleTopicChange = (event: SelectChangeEvent<string>) => {
    setSelectedTopic(event.target.value)
  }

  // Function to handle form submission
  const handleSubmit = () => {
    // Perform form submission logic here
    // console.log('Form submitted!')
  }

  // Example topic and sub-topic arrays
  const topics: string[] = ['React', 'Node.js', 'Express']
  const subTopics: { [key: string]: string[] } = {
    React: ['Hooks', 'Context API', 'Redux'],
    'Node.js': ['Express.js', 'Socket.io', 'RESTful APIs'],
    Express: ['Middleware', 'Routing', 'Error Handling'],
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

        {/* Select for Tutorial */}
        <FormControl fullWidth>
          <Autocomplete
            freeSolo
            id="search-category"
            options={[]}
            onInputChange={() => console.log('dssss')}
            renderInput={(params) => (
              <TextField {...params} label="Search Category" />
            )}
          />
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
          <Select
            defaultValue=""
            id="grouped-select"
            label="Grouping"
            value={selectedTopic}
            onChange={handleTopicChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {topics.map((topic, index) => (
              <React.Fragment key={index}>
                <ListSubheader>{topic}</ListSubheader>
                {subTopics[topic].map((subTopic, subIndex) => (
                  <MenuItem key={`${topic}-${subIndex}`} value={subTopic}>
                    {subTopic}
                  </MenuItem>
                ))}
              </React.Fragment>
            ))}
          </Select>
        </FormControl>

        {/* Select for Content Writer */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="content-writer-select-label">
            Select Content Writer
          </InputLabel>
          <Select
            labelId="content-writer-select-label"
            id="content-writer-select"
            value={selectedContentWriter}
            onChange={handleContentWriterChange}
          >
            <MenuItem value={'writer1'}>Lokesh Dwivedi</MenuItem>
            <MenuItem value={'writer2'}>Prince kumar</MenuItem>
            <MenuItem value={'writer2'}>Chaitanya Kaushal</MenuItem>
            {/* Add more writer options here */}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Assign
        </Button>
      </Box>
    </BaseLayout>
  )
}

export default AssignTutorialContent
