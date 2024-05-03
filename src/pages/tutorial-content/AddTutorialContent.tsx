import { BaseLayout } from '../../components/BaseLayout'
import { useSearchParams } from 'react-router-dom'
import { Box, Button, InputLabel, TextField, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useLocation } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { useState } from 'react'

function AddTutorialContent() {
  // const navigate = useNavigate()
  const [params] = useSearchParams()
  const location = useLocation()
  const rowData = location.state?.rowData

  const [contentAssigneeName, setContentAssigneeName] = useState<string>('')
  const [reviewerAssigneeName, setReviewerAssigneeName] = useState<string>('')
  const [status, setStatus] = useState<string>('')

  const handleContentAssigneeNameChange = (
    event: SelectChangeEvent<string>,
  ) => {
    setContentAssigneeName(event.target.value)
  }
  const handleReviewerAssigneeNameChange = (
    event: SelectChangeEvent<string>,
  ) => {
    setReviewerAssigneeName(event.target.value)
  }
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatus(event.target.value)
  }

  return (
    // <BaseLayout title={params.get('/edit') ? 'Edit Tutorials' : 'Add Tutorials'}>
    <BaseLayout title="Add Tutorial Content">
      <Box
        component="form"
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
          {params.get('edit') ? 'Edit Tutorials' : 'Add Tutorials'}
        </Typography>
        <TextField label="Sub-Topic Name" required value={rowData?.title} />
        <TextField label="Tutorial Name" required value={rowData?.title} />

        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Content Assignee Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={contentAssigneeName}
              label="ContentAssigneeName"
              onChange={handleContentAssigneeNameChange}
            >
              <MenuItem value={10}>Lokesh</MenuItem>
              <MenuItem value={20}>Raushan</MenuItem>
              <MenuItem value={30}>Prince</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Reviewer Assignee Name
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={reviewerAssigneeName}
              label="ContentAssigneeName"
              onChange={handleReviewerAssigneeNameChange}
            >
              <MenuItem value={10}>Lokesh</MenuItem>
              <MenuItem value={20}>Raushan</MenuItem>
              <MenuItem value={30}>Prince</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label="ContentAssigneeName"
              onChange={handleStatusChange}
            >
              <MenuItem value={10}>Content Assigned</MenuItem>
              <MenuItem value={20}>Content Done</MenuItem>
              <MenuItem value={30}>Review Assigned</MenuItem>
              <MenuItem value={30}>Changes Needed</MenuItem>
              <MenuItem value={30}>Ready To Publish</MenuItem>
              <MenuItem value={30}>Published</MenuItem>
              <MenuItem value={30}>Unpublished</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TextField
            label="Tutorial Topic"
            required
            value={rowData?.title}
            fullWidth
          />
          <TextField
            label="Tutorial Sub Topic"
            required
            value={rowData?.title}
            fullWidth
          />
        </Box> */}
        <Button variant="contained" sx={{}} onClick={() => {}}>
          Create
        </Button>
      </Box>
    </BaseLayout>
  )
}

export default AddTutorialContent
