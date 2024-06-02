/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
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
  const [editorData, setEditorData] = useState<string | undefined>()
  const [openAssignReviewerModal, setOpenAssignReviewerModal] = useState(false)
  const handleClickOpenAssignReviewerModal = () => {
    setOpenAssignReviewerModal(true)
  }



   const handleClose = () => {
    setOpenAssignReviewerModal(false)
  }

  useEffect(() => {
    const callData = async () => {
      const data = await getWritterContent(url.id)
      if (data?.data) {
        setEditorData(data.data)
      }
    }
    callData()
  }, [url.id])
  const handleClick = async () => {
    await writeContent(url.id, editorData)
  }
  return (
    <BaseLayout title="Content Editor">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'start',
              fontWeight: 550,
            }}
          >
            {url && url.suntopicname?.toUpperCase()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              variant="contained"
              onClick={handleClickOpenAssignReviewerModal}
            >
              Assign Content Reviewer
            </Button>
            <Button variant="contained">Generate Content Using AI</Button>
          </Box>
        </Box>
        {/* //Dialog */}
        {openAssignReviewerModal && (
          <Dialog
            open={openAssignReviewerModal}
            onClose={handleClose}
            PaperProps={{
              component: 'form',
              onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault()
                const formData = new FormData(event.currentTarget)
                const formJson = Object.fromEntries((formData as any).entries())
                const email = formJson.email
                console.log(email)
                handleClose()
              },
            }}
          >
            <DialogTitle>Assign Content Reviewer</DialogTitle>
            <DialogContent>
              <TextField
                label="Search reviewer"
                fullWidth
                // value={}
                onChange={() => {}}
                sx={{ marginBottom: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Assign</Button>
            </DialogActions>
          </Dialog>
        )}
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
        <Box sx={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
          <Button onClick={handleClick} variant="contained" sx={{ width: 200 }}>
            Submit Content
          </Button>
        </Box>
      </Box>
    </BaseLayout>
  )
}
export default ContentSubTopicEditorPage
