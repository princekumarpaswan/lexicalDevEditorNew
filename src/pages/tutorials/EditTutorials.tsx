import { BaseLayout } from '../../components/BaseLayout'
import { useSearchParams } from 'react-router-dom'
import { Box, Button, TextField, Typography } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { Theme, useTheme } from '@mui/material/styles'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React from 'react'

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

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

function AddTutorials() {
  // const navigate = useNavigate()
  const [params] = useSearchParams()
  const location = useLocation()
  const rowData = location.state?.rowData

  const theme = useTheme()
  const [personName, setPersonName] = React.useState<string[]>([])

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  return (
    <BaseLayout title={params.get('') ? 'Edit Tutorials' : 'Add Tutorials'}>
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
        <TextField label="Tutorial Title" required value={rowData?.title} />

        <TextField
          required
          label="Tutorial Description"
          multiline
          rows={4}
          value={rowData?.description}
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
              multiple
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

        <Box
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
        </Box>
        <Button variant="contained" sx={{}} onClick={() => {}}>
          Generate Topic using AI
        </Button>
      </Box>
    </BaseLayout>
  )
}

export default AddTutorials
