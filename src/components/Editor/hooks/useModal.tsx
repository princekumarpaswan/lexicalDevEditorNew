import * as React from 'react'
import { useState, useCallback, useMemo } from 'react'

import ModalWrapper from '../components/ui/Modal'

interface ModalContent {
  title: string
  content: React.ReactNode
  closeOnClickOutside?: boolean
}

export default function useModal(): [
  React.ReactNode | null,
  (
    title: string,
    getContent: (onClose: () => void) => React.ReactNode,
    closeOnClickOutside?: boolean
  ) => void
] {
  const [modalContent, setModalContent] = useState<ModalContent | null>(null)

  const onClose = useCallback(() => {
    setModalContent(null)
  }, [])

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null
    }
    const { title, content, closeOnClickOutside } = modalContent
    return (
      <ModalWrapper
        onClose={onClose}
        title={title}
        open={!!modalContent}
        closeOnClickOutside={closeOnClickOutside}
      >
        {content}
      </ModalWrapper>
    )
  }, [modalContent, onClose])

  const showModal = useCallback(
    (
      title: string,
      getContent: (onClose: () => void) => React.ReactNode,
      closeOnClickOutside = false
    ) => {
      setModalContent({
        closeOnClickOutside,
        content: getContent(onClose),
        title,
      })
    },
    [onClose]
  )

  return [modal, showModal]
}
