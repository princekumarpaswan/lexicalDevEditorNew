import { Box, Button, Paper, Typography } from '@mui/material'
import { BaseLayout } from '../../components/BaseLayout'
import EditorWrapper from '../../components/Editor/components/Editor/EditorWrapper'

const ContentSubTopicEditorPage = () => {
  return (
    <BaseLayout title="Content Editor">
      <Paper sx={{ padding: 20 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            justifyContent: 'center',
            // alignItems: 'center',
          }}
        >
          <Box>
            <Typography sx={{ display: 'flex', justifyContent: 'center' }}>
              Sub-Topic Name :
            </Typography>
          </Box>
          <Box>
            <EditorWrapper
              onEditorChange={function (): void {
                throw new Error('Function not implemented.')
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
            <Button variant="contained">Submit</Button>
            <Button variant="contained">Content Done</Button>
          </Box>
        </Box>
      </Paper>
    </BaseLayout>
  )
}

export default ContentSubTopicEditorPage
