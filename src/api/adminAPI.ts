/* eslint-disable no-console */
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
      'https://a6f7-2409-40e4-20-e0ac-bd1b-85a7-2e09-1d16.ngrok-free.app/api/v1/admins/create',
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
