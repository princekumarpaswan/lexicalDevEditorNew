import { Box, Button, TextField } from '@mui/material'
import { BaseLayout } from '../../components/BaseLayout'

const AddCategories = () => {
  return (
    <>
      <BaseLayout title="Add Categories ">
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <TextField
              label="Category Name"
              required
              //   value={rowData?.title}
              fullWidth
            />
            <Button variant="contained" sx={{}} onClick={() => {}}>
              Add Category
            </Button>
          </Box>
        </Box>
      </BaseLayout>
    </>
  )
}

export default AddCategories
