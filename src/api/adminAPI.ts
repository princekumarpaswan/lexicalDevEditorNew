/* eslint-disable no-useless-catch */
import axios from 'axios'

export const createAdmin = async (
  fullName: string,
  email: string,
  password: string,
  role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER',
) => {
  try {
    const response = await axios.post(
      'http://localhost:4444/api/v1/admins/create',
      {
        fullName,
        email,
        password,
        role,
      },
    )
    return response.data
  } catch (error) {
    throw error
  }
}
