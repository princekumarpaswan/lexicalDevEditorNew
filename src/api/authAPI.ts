/* eslint-disable no-useless-catch */
import axios from 'axios'

interface LoginResponse {
  data: {
    accessToken: string
    type: string
    role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER'
  }
  statusCode: number
  success: boolean
}

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post<LoginResponse>(
      'https://a6f7-2409-40e4-20-e0ac-bd1b-85a7-2e09-1d16.ngrok-free.app/api/v1/admins/login',
      JSON.stringify({ email, password }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    const { accessToken, role } = response.data.data
    return { accessToken, role }
  } catch (error) {
    throw error
  }
}
