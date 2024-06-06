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
  aiPolling,
  assignReviewer,
  getAiID,
  getWritterContent,
  updateSubtopicStatus,
  writeContent,
} from '../../api/tutorialContentAPI'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { getAdminBYRoll } from '../../api/tutorialContentAPI'
import { AuthContext } from '../../context/AuthContext/AuthContext'
import BorderColorIcon from '@mui/icons-material/BorderColor'
import SnackbarComponent from '../../components/SnackBar'
import ContentContext from '../../context/contentText'

interface Admin {
  id: string
  fullName: string
  role: string
  email: string
}

const ContentSubTopicEditorPage = () => {
  const { state } = useContext(AuthContext)
  const role = state.user?.role

  const base = JSON.stringify({
    root: {
      children: [
        {
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
        },
        {
          children: [],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  })
  const {content , setContent} = useContext(ContentContext)
  const navigate = useNavigate()
  const url = useParams()

  const [editorData, setEditorData] = useState<string | undefined>('')
  const [openAssignReviewerModal, setOpenAssignReviewerModal] = useState(false)
  const [subTopicName, setSubTopicName] = useState<string | undefined>('')

  useEffect(() => {
    if (url.id) {
      localStorage.setItem('subTopicID', url?.id)
      //  console.log(url.suntopicname);
      const name = url.suntopicname?.split('-').join(' ')
      setSubTopicName(name)
    }
  }, [url])

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
  const [apiStatus, setApiStatus] = useState('')
  const [aiData, setAIData] = useState()
  const [aiTrue,setAiTrue] = useState(false)
  const [newData ,setNewData] = useState({})
  const pollForAIContentTime = 10000

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
        // setTriggerEffect((prev) => !prev) // Toggle the triggerEffect state
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
          setContent(data.data)
          setEditorData(data.data)
          if (data.data.content === '[object Object]') {
            setEditorData(base)
          } else {
            setEditorData(data.data)
             setContent(data.data)
            console.log(data.data.status)
            setApiStatus(data.data.status)
          }

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
      const response = await writeContent(url.id, editorData)
      setSnackbarOpen(true)
      setSnackbarMessage('Content Done Successfully')
      setIsLoading(false)
      setSubtopicStatus('CONTENT_DONE')
      localStorage.setItem('subtopicStatus', 'CONTENT_DONE')
      // setTriggerEffect((prev) => !prev)
      if (response) {
        navigate('/tutorial-content')
      }
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
        console.log(editorData)

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
        if (response) {
          navigate('/tutorial-content')
        }
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

  const handleGenerateContentAI = async () => {
    try {
      if (url && subTopicName) {
        const response = await getAiID(subTopicName)
        if (response?.data?.id) {
          const id = response?.data?.id
          pollForAIContent(id)
        }
      }
    } catch (error) {
      console.error('Error generating AI content:', error)
      setSnackbarOpen(true)
      setErrorMsg('Error Generating AI Content')
      setIsLoading(false)
    }
  }

  const pollForAIContent = async (taskId: string) => {
    const checkStatus = async () => {
      try {
        const response = await aiPolling(taskId)
        const status = response.data.status
        console.log('AI Content Generation Status:', status)
        if (status !== 'pending') {
          setAIData(response?.data)
          setAiTrue(true)
          // setEditorData(response?.data)
          setSnackbarOpen(true)
          setSnackbarMessage('AI Content Generated Successfully')
          setIsLoading(false)
        } else if (status === 'FAILED') {
          setSnackbarOpen(true)
          setErrorMsg('AI Content Generation Failed')
          setIsLoading(false)
        } else {
          setTimeout(checkStatus, pollForAIContentTime)
        }
      } catch (error) {
        console.error('Error polling for AI content:', error)
        setSnackbarOpen(true)
        setErrorMsg('Error Polling for AI Content')
        setIsLoading(false)
      }
    }
    checkStatus()
  }


  useEffect(() => {
 if(aiData){
   const base = {
  "root": {
    "children": [
      {
        "children": [
          {
            "detail": 0,
            "format": 0,
            "mode": "normal",
            "style": "",
            "text": `${aiData?.contentAI}`,
            "type": "text",
            "version": 1
          }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "paragraph",
        "version": 1,
        "textFormat": 0
      }
    ],
    "direction": "ltr",
    "format": "",
    "indent": 0,
    "type": "root",
    "version": 1
  }
 }
//  let data = content.content
 const  data  = {content: JSON.stringify(base)}

  console.log(data);
  
  // setContent(data)
  setNewData(data)
  setAiTrue(true)
  // console.log('insid ai if');
  // console.log(content);
  // console.log(content);
 } 
 
  },[aiData])
  //  console.log('opem');
  // console.log(content);


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
                <Button
                  variant="contained"
                  onClick={() => handleGenerateContentAI()}
                >
                  Generate Content Using AI
                </Button>
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

            {content && !aiTrue && (
              <>
                <EditorWrapper
                  onEditorChange={(e) => setEditorData(e)}
                  initialContent={content}
                  status={apiStatus}
                />
              </>
            )}
            {
              aiTrue && newData?.content &&(
                  <>
                <EditorWrapper
                  onEditorChange={(e) => setEditorData(e)}
                  initialContent={newData}
                  status={apiStatus}
                />
              </>
              )
            }

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
                disabled={editorData && editorData?.length > 1 ? false : true}
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
