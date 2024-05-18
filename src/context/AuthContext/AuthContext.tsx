// AuthProvider.tsx

import React, { createContext, useReducer, useEffect } from 'react'
import AuthReducer, { AuthState, AuthAction } from './AuthReducer'

const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
}

export const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}>({
  state: initialState,
  dispatch: () => null,
})

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState)

  useEffect(() => {
    const storedState = localStorage.getItem('authState')
    if (storedState) {
      const parsedState: AuthState = JSON.parse(storedState)
      dispatch({ type: 'RESTORE_STATE', payload: parsedState })
    }
  }, [])

  // Persist token to localStorage whenever it changes
  useEffect(() => {
    if (state.accessToken) {
      localStorage.setItem('accessToken', state.accessToken)
    } else {
      localStorage.removeItem('accessToken')
    }
  }, [state.accessToken])

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}
