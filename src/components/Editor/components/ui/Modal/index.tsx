import * as React from 'react'
import { Box, Typography, Modal, Divider } from '@mui/material'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title: string
  closeOnClickOutside?: boolean
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
}

export default function ModalWrapper({
  open,
  onClose,
  children,
  title,
  closeOnClickOutside = false,
}: ModalProps) {
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{ px: 1 }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {title}
          </Typography>
          <Divider />
          <Box sx={{ p: 2 }}>{children}</Box>
        </Box>
      </Modal>
    </div>
  )
}
