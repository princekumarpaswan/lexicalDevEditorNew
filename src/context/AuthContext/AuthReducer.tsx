/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AuthState {
  user: null | {
    id: string
    fullName: string
    email: string
    role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
  }
  accessToken: string | null
}

export type AuthAction =
  | {
      type: 'LOGIN_SUCCESS'
      payload: {
        user: AuthState['user']
        accessToken: string
      }
    }
  | { type: 'LOGOUT' }
  | {
      type: 'RESTORE_STATE'
      payload: AuthState
    }

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      const { user, accessToken } = action.payload
      if (user !== null) {
        const serializedUser = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        }
        localStorage.setItem(
          'authState',
          JSON.stringify({ user: serializedUser, accessToken }),
        )
      }
      return { ...state, user, accessToken }
    case 'LOGOUT':
      localStorage.removeItem('authState')
      localStorage.removeItem('userData')
      localStorage.removeItem('theme')
      return { ...state, user: null, accessToken: null }
    case 'RESTORE_STATE':
      return action.payload
    default:
      return state
  }
}

export default AuthReducer
