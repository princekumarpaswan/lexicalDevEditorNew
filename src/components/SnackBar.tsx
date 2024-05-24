import * as React from 'react'
import { AlertColor, Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  },
)

type Props = {
  open: boolean
  message: string
  severity: AlertColor
  closeSnackbar: () => void
}

const SnackbarComponent = (props: Props) => {
  const { open, message, severity, closeSnackbar } = props

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={closeSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={closeSnackbar} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SnackbarComponent
