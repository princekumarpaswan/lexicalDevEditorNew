interface AuthState {
  user: null | {
    id: string
    fullName: string
    email: string
    role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
  }
  accessToken: string | null
}

type AuthAction =
  | {
      type: 'LOGIN_SUCCESS'
      payload: { user: AuthState['user']; accessToken: string }
    }
  | { type: 'LOGOUT' }

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
      }
    default:
      return state
  }
}

export default AuthReducer
