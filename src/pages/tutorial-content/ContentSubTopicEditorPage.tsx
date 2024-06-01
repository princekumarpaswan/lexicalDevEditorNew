import { Box, Button, Typography } from '@mui/material'
import { BaseLayout } from '../../components/BaseLayout'
import EditorWrapper from '../../components/Editor/components/Editor/EditorWrapper'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getWritterContent, writeContent } from '../../api/tutorialContentAPI'

const ContentSubTopicEditorPage = () => {
  const url = useParams()

  useEffect(() => {
    if (url.id) {
      localStorage.setItem('subTopicID', url?.id)
    }
  }, [url])

  const [editorData, setEditorData] = useState<string | undefined>();

  useEffect(() => {
    const callData = async () => {
      const data = await getWritterContent(url.id);
      if (data?.data?.content) {
        setEditorData(data.data.content);
      }
    };

    callData();
  }, [url.id]);

  const handleClick = async () => {
    await writeContent(url.id, editorData)
  }

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
         {editorData && (
        <>
          <EditorWrapper
            onEditorChange={(e) => setEditorData(e)}
            initialContent={editorData}
          />
        </>
      )}
        </Box>
        <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          <Button onClick={handleClick} variant="contained">
            Submit
          </Button>
          <Button variant="contained">Content Done</Button>
        </Box>
      </Box>
    </BaseLayout>
  )
}

export default ContentSubTopicEditorPage
