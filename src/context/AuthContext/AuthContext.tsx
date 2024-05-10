/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useReducer } from 'react'
import AuthReducer from './AuthReducer'

interface AuthState {
  user: null | {
    id: string
    fullName: string
    email: string
    role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
  }
  accessToken: string | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
}

export const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => null,
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
