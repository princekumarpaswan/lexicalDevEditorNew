/* eslint-disable no-console */
import { FilterAlt } from '@mui/icons-material'
import {
  Autocomplete,
  Button,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext/AuthContext'

const TutorialsContentFilter: React.FC = () => {
  const { state } = useContext(AuthContext)
  const role = state.user?.role

  const [showFilterBox, setShowFilterBox] = useState<null | HTMLElement>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const toggleFilterBox = (event: React.MouseEvent<HTMLElement>) => {
    setShowFilterBox(showFilterBox ? null : event.currentTarget)
  }

  const handleFilterCancel = () => {
    setFilterStatus(null)
    setShowFilterBox(null)
  }

  const handleFilterReset = async () => {
    console.log('reset filter')
  }

  const handleFilterFetch = async () => {
    console.log('reset filter')
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginRight: 20,
          gap: 20,
        }}
      >
        <Grid item>
          <Tooltip title="Filters for Tutorial Content">
            <Button
              variant="outlined"
              endIcon={<FilterAlt color="primary" />}
              onClick={toggleFilterBox}
            >
              Filters
            </Button>
          </Tooltip>
        </Grid>

        <Menu
          anchorEl={showFilterBox}
          open={Boolean(showFilterBox)}
          onClose={handleFilterCancel}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          sx={{
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              padding: 3,
              width: 'auto',
            }}
          >
            <Grid
              sx={{
                display: 'flex',
                gap: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid item sx={{ display: 'flex', gap: 3 }}>
                {(role === 'ADMIN' || role === 'CONTENT_REVIEWER') && (
                  <Autocomplete
                    freeSolo
                    id="search-categories"
                    options={[]}
                    inputValue=""
                    onInputChange={() => {}}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by Content Writer Name"
                      />
                    )}
                    sx={{ width: 280 }}
                  />
                )}
                {(role === 'ADMIN' || role === 'CONTENT_WRITER') && (
                  <Autocomplete
                    freeSolo
                    id="search-categories"
                    options={[]}
                    inputValue=""
                    onInputChange={() => {}}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Filter by Content Reviewer Name"
                      />
                    )}
                    sx={{ width: 280 }}
                  />
                )}
              </Grid>
              <Grid item>
                <TextField
                  select
                  label="Filter by Status"
                  value={filterStatus || ''}
                  onChange={(event) => setFilterStatus(event.target.value)}
                  sx={{ width: 180 }}
                >
                  <MenuItem value="Filter" disabled>
                    Select Item
                  </MenuItem>
                  <MenuItem value="Content Assigned">Content Assigned</MenuItem>
                  <MenuItem value="Review Assigned">Review Assigned</MenuItem>
                  <MenuItem value="Content Done">Content Done</MenuItem>
                  <MenuItem value="Changes Needed">Changes Needed</MenuItem>
                  <MenuItem value="Ready To Publish">Ready To Publish</MenuItem>
                  <MenuItem value="Unpublished">Unpublished</MenuItem>
                  <MenuItem value="Published">Published</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 3,
              }}
            >
              <Grid item>
                <Button variant="outlined" onClick={handleFilterCancel}>
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleFilterReset}>
                  Reset And Fetch
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={handleFilterFetch}>
                  Fetch
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Menu>
      </div>
    </div>
  )
}

export default TutorialsContentFilter
