/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { BaseLayout } from '../../components/BaseLayout'
import EditorWrapper from '../../components/Editor/components/Editor/EditorWrapper'
import { useNavigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import {
  assignReviewer,
  getWritterContent,
  writeContent,
} from '../../api/tutorialContentAPI'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getAdminBYRoll } from '../../api/tutorialContentAPI'
import { AuthContext } from '../../context/AuthContext/AuthContext'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import SnackbarComponent from '../../components/SnackBar'

interface Admin {
  id: string
  fullName: string
  role: string
  email: string
}

const ContentSubTopicEditorPage = () => {
  const { state } = useContext(AuthContext)
  const role = state.user?.role

  const navigate = useNavigate()
  const url = useParams()
  useEffect(() => {
    if (url.id) {
      localStorage.setItem('subTopicID', url?.id)
    }
  }, [url])
  const [editorData, setEditorData] = useState<string | undefined>()
  const [openAssignReviewerModal, setOpenAssignReviewerModal] = useState(false)

  const [allAdminData, setAllAdminData] = useState<Admin[]>([])
  const [reviewerOptions, setReviewerOptions] = useState<
    { label: string; id: string }[]
  >([])
  const [reviewerInputValue, setReviewerInputValue] = useState('')
  const [selectedReviewer, setSelectedReviewer] = useState<{
    label: string
    id: string
  } | null>(null)
  const [subtopicStatus, setSubtopicStatus] = useState<string>(
    localStorage.getItem('subtopicStatus') || '',
  )
  const [reviewerName, setReviewerName] = useState<string>('')
  const [tutorialName, setTutorialName] = useState<string>('')

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const formatRole = (role: string) => {
    return role
      .toLowerCase()
      .split('_')
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const filterReviewers = (query: string) => {
    if (query) {
      const filteredAdmins = allAdminData.filter(
        (admin) =>
          admin.fullName.toLowerCase().includes(query.toLowerCase()) ||
          admin.role.toLowerCase().includes(query.toLowerCase()),
      )
      const contentReviewers = filteredAdmins.filter(
        (admin) => admin.role === 'CONTENT_REVIEWER' || admin.role === 'ADMIN',
      )
      const options = contentReviewers.map((admin) => ({
        label: `${admin.fullName} - ${formatRole(admin.role)}`,
        id: admin.id,
      }))
      setReviewerOptions(options)
    } else {
      setReviewerOptions([])
    }
  }

  useEffect(() => {
    const handleAdmin = async () => {
      try {
        const response = await getAdminBYRoll()
        setAllAdminData(response.data)
      } catch (error) {
        console.error('Error fetching admins:', error)
      }
    }

    handleAdmin()
  }, [])

  const handleClickOpenAssignReviewerModal = () => {
    setOpenAssignReviewerModal(true)
  }

  const handleAssignReviewer = async () => {
    try {
      handleClose()
      setIsLoading(true)
      const subtopicId = localStorage.getItem('subTopicID') ?? ''
      if (subtopicId && selectedReviewer) {
        const response = await assignReviewer(subtopicId, selectedReviewer.id)
        console.log('Reviewer assigned successfully:', response)
        setSelectedReviewer(null)
        setReviewerName(selectedReviewer.label)

        setSubtopicStatus('Review Assigned')

        localStorage.setItem('subtopicStatus', 'Review Assigned')

        setIsLoading(false)
        setSnackbarOpen(true)
        setSnackbarMessage('Reviewer Assigned Successfully')
      } else if (!selectedReviewer) {
        console.error('No reviewer selected')
        setIsLoading(false)
        setSnackbarOpen(true)
        setErrorMsg('Error Assigning Reviewer')
      } else {
        console.error('Subtopic ID not found in local storage')
        setIsLoading(false)
        setSnackbarOpen(true)
        setErrorMsg('Error Assigning Reviewer')
      }
    } catch (error) {
      console.error('Error assigning reviewer:', error)
      setIsLoading(false)
      setSnackbarOpen(true)
      setErrorMsg('Error Assigning Reviewer')
    }
  }

  const handleClose = () => {
    setOpenAssignReviewerModal(false)
  }

  useEffect(() => {
    const callData = async () => {
      try {
        setIsLoading(true)
        const data = await getWritterContent(url.id)
        console.log('API Response:', data)
        if (data?.data) {
          setEditorData(data.data)

          const tutorialName = data?.data?.tutorialInfo?.tutorialName
          setTutorialName(tutorialName)

          setReviewerName(data?.data?.reviewerInfo?.fullName)

          const subTopicStatus = data.data.status
          if (subTopicStatus) {
            setSubtopicStatus(subTopicStatus)
          }
          console.log('status reponse:', subTopicStatus)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching writer content:', error)
      }
    }
    callData()
  }, [url.id])

  useEffect(() => {
    const storedStatus = localStorage.getItem('subtopicStatus') || ''
    setSubtopicStatus(storedStatus)
  }, [])

  const handleClick = async () => {
    try {
      setIsLoading(true)
      await writeContent(url.id, editorData)
      setSnackbarOpen(true)
      setSnackbarMessage('Content Done Successfully')
      setIsLoading(false)
    } catch (error) {
      setSnackbarOpen(true)
      setErrorMsg('Error Submitting Content')
    }
  }
  return (
    <BaseLayout title="Content Editor">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          gap: 5,
          maxWidth: '1050px',
          margin: 'auto',
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
              height: 570,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => navigate(-1)}
                color="inherit"
                size="large"
              >
                <ArrowBackIcon />
              </IconButton>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    fontWeight: 550,
                  }}
                >
                  Sub-topic Name : {url && url.suntopicname?.toUpperCase()}
                </Typography>
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'start',
                    fontWeight: 550,
                  }}
                >
                  Tutorial Name : {tutorialName?.toUpperCase()}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {role === 'ADMIN' && subtopicStatus === 'CONTENT_DONE' && (
                <Button
                  variant="contained"
                  onClick={handleClickOpenAssignReviewerModal}
                >
                  Assign Content Reviewer
                </Button>
              )}
              {role === 'ADMIN' && subtopicStatus === 'REVIEW_ASSIGNED' && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    border: 0.5,
                    padding: 1,
                    borderRadius: 3,
                    borderColor: 'lightgray',
                  }}
                >
                  <Typography sx={{ fontWeight: 550 }}>
                    Reviewer: {reviewerName}
                  </Typography>
                  <IconButton onClick={handleClickOpenAssignReviewerModal}>
                    <BorderColorIcon />
                  </IconButton>
                </Box>
              )}
              {(role === 'CONTENT_WRITER' || role === 'ADMIN') && (
                <Button variant="contained">Generate Content Using AI</Button>
              )}
            </Box>
          </Box>
        )}

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
            <DialogTitle> Search The Content Reviewer Name</DialogTitle>
            <DialogContent>
              <Autocomplete
                id="search-reviewer"
                options={reviewerOptions}
                onInputChange={(_e, value) => {
                  setReviewerInputValue(value)
                  filterReviewers(value)
                }}
                inputValue={reviewerInputValue}
                value={selectedReviewer}
                onChange={(_event, newValue) => setSelectedReviewer(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Search Content Reviewer Name" />
                )}
              />
            </DialogContent>
            <DialogActions>
              <DialogActions>
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleAssignReviewer}>
                  Assign
                </Button>
              </DialogActions>
            </DialogActions>
          </Dialog>
        )}
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'center',
              alignItems: 'center',
              height: 570,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
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
        )}

        <Box sx={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
          <Button onClick={handleClick} variant="contained" sx={{ width: 200 }}>
            Submit Content
          </Button>
        </Box>
      </Box>
      <SnackbarComponent
        severity="success"
        open={snackbarOpen}
        message={snackbarMessage}
        closeSnackbar={() => setSnackbarOpen(false)}
      />
      <SnackbarComponent
        severity="error"
        message={errorMsg}
        open={!!errorMsg}
        closeSnackbar={() => setErrorMsg('')}
      />
    </BaseLayout>
  )
}
export default ContentSubTopicEditorPage
