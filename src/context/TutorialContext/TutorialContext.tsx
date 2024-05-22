import React, { createContext, useState } from 'react'

interface TutorialContextData {
  tutorialId: string | null
  setTutorialId: (id: string | null) => void
  setTutorialName: (id: string | null) => void
}

export const TutorialContext = createContext<TutorialContextData>({
  tutorialId: null,
  setTutorialId: () => {},
  setTutorialName: () => {},
})

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tutorialId, setTutorialId] = useState<string | null>(null)

  const contextValue: TutorialContextData = {
    tutorialId,
    setTutorialId,
    setTutorialName: () => {},
  }

  return (
    <TutorialContext.Provider value={contextValue}>
      {children}
    </TutorialContext.Provider>
  )
}
