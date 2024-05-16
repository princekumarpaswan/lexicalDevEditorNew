/* eslint-disable no-useless-catch */
import axios from 'axios'
import { BASE_URL } from '../constants/ApiConstant'

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
