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
  updateSubtopicStatus,
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
  const [triggerEffect, setTriggerEffect] = useState(false)

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
        setTriggerEffect((prev) => !prev) // Toggle the triggerEffect state
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
  }, [url.id, triggerEffect])

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

      setSubtopicStatus('CONTENT_DONE')
      localStorage.setItem('subtopicStatus', 'CONTENT_DONE')
      setTriggerEffect((prev) => !prev)
    } catch (error) {
      setSnackbarOpen(true)
      setErrorMsg('Error Submitting Content')
    }
  }

  const handleReadyToPublish = async () => {
    console.log('Ready to publish clicked')

    try {
      const subtopicId = localStorage.getItem('subTopicID') ?? ''
      if (subtopicId && editorData && editorData.length > 1) {
        const response = await updateSubtopicStatus(
          subtopicId,
          'READY_TO_PUBLISH',
          editorData,
        )
        console.log(response)
         if (response) {
          navigate('/tutorial-content')
        }
        setSubtopicStatus('READY_TO_PUBLISH')
      } else if (subtopicId) {
        const response = await updateSubtopicStatus(
          subtopicId,
          'READY_TO_PUBLISH',
        )
        console.log(response)
        setSubtopicStatus('READY_TO_PUBLISH')
      } else {
        console.error('Subtopic ID not found in local storage')
      }
    } catch (error) {
      console.error('Error updating subtopic status:', error)
    }
  }
  const handleChangesNeededClick = async () => {
    console.log('Changes needed clicked')

    try {
      const subtopicId = localStorage.getItem('subTopicID') ?? ''
      if (subtopicId && editorData && editorData.length > 1) {
        const response = await updateSubtopicStatus(
          subtopicId,
          'CHANGES_NEEDED',
          editorData,
        )
        console.log(response)
        if (response) {
          navigate('/tutorial-content')
        }
        setSubtopicStatus('CHANGES_NEEDED')
      } else if (subtopicId) {
        const response = await updateSubtopicStatus(
          subtopicId,
          'CHANGES_NEEDED',
        )
        console.log(response)
        setSubtopicStatus('CHANGES_NEEDED')
      } else {
        console.error('Subtopic ID not found in local storage')
      }
    } catch (error) {
      console.error('Error updating subtopic status:', error)
    }
  }

  useEffect(() => {
    if (role === 'CONTENT_REVIEWER') {
      setSnackbarOpen(true)
      setErrorMsg(
        "You are not allowed to edit the Content, please don't do edit !!",
      )
    }
  }, [editorData])

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
              height: 670,
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
              {role === 'ADMIN' && subtopicStatus === 'CONTENT_DONE' && !reviewerName && (
                <Button
                  variant="contained"
                  onClick={handleClickOpenAssignReviewerModal}
                >
                  Assign Content Reviewer
                </Button>
              )}
              {role === 'ADMIN' &&
                (subtopicStatus === 'REVIEW_ASSIGNED' || reviewerName) && (
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
              height: 670,
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
          {/* CONTENT_WRITER */}
          {role === 'CONTENT_WRITER' &&
            (subtopicStatus === 'CONTENT_ASSIGNED' ||
              subtopicStatus === 'CHANGES_NEEDED') && (
              <Button
                disabled={editorData && editorData?.length > 1 ? false : true}
                onClick={handleClick}
                variant="contained"
                sx={{ width: 200 }}
              >
                Submit Content
              </Button>
            )}

          {/* ADMIN */}
          {role === 'ADMIN' &&
            (subtopicStatus === 'CHANGES_NEEDED' ||
              subtopicStatus === 'CONTENT_ASSIGNED' ||
              subtopicStatus === 'TO_ASSIGN') && (
              <Button
                onClick={handleClick}
                variant="contained"
                sx={{ width: 200 }}
              >
                Submit Content
              </Button>
            )}
          {role === 'ADMIN' &&
            (subtopicStatus === 'CONTENT_DONE' ||
              subtopicStatus === 'REVIEW_ASSIGNED') && (
              <>
                <Button
                  variant="contained"
                  onClick={handleChangesNeededClick}
                  sx={{ width: 200 }}
                >
                  Changes Needed
                </Button>
                <Button
                  onClick={handleReadyToPublish}
                  variant="contained"
                  sx={{ width: 200 }}
                >
                  Ready To Publish
                </Button>
              </>
            )}

          {/* CONTENT_REVIEWER */}
          {role === 'CONTENT_REVIEWER' &&
            (subtopicStatus === 'CONTENT_DONE' ||
              subtopicStatus === 'REVIEW_ASSIGNED') && (
              <>
                <Button
                  onClick={handleChangesNeededClick}
                  variant="contained"
                  sx={{ width: 200 }}
                >
                  Changes Needed
                </Button>
                <Button
                  onClick={handleReadyToPublish}
                  variant="contained"
                  sx={{ width: 200 }}
                >
                  Ready To Publish
                </Button>
              </>
            )}
        </Box>
        {/* <Box sx={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
          {(role === 'ADMIN' || role === 'CONTENT_WRITER') && (
            <Button
              onClick={handleClick}
              variant="contained"
              sx={{ width: 200 }}
            >
              Submit Content
            </Button>
          )}
          {(role === 'ADMIN' || role === 'CONTENT_WRITER') && (
            <Button
              onClick={handleClick}
              variant="contained"
              sx={{ width: 200 }}
            >
              Changes Needed
            </Button>
          )}
          {(role === 'ADMIN' || role === 'CONTENT_REVIEWER') && (
            <Button
              onClick={handleReadyToPublish}
              variant="contained"
              sx={{ width: 200 }}
            >
              Ready To Publish
            </Button>
          )}
        </Box> */}
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
