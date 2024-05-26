import { Box, Button, Typography } from '@mui/material'
import { BaseLayout } from '../../components/BaseLayout'
import EditorWrapper from '../../components/Editor/components/Editor/EditorWrapper'
import { useParams } from 'react-router-dom'

const ContentSubTopicEditorPage = () => {
  const url = useParams()

  return (
    <BaseLayout title="Content Editor">
      <Box>
        <Box>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'start',
              fontWeight: 700,
              marginBottom: '20px',
            }}
          >
            {url && url.suntopicname?.toUpperCase()}
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
    </BaseLayout>
  )
}

export default ContentSubTopicEditorPage
