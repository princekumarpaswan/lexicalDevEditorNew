/* eslint-disable no-useless-catch */
import axios from 'axios'

const BASE_URL = `http://localhost:4444/api/v1`

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
      // 'http://localhost:4444/api/v1/admins/login',
      `${BASE_URL}/admins/login`,
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
