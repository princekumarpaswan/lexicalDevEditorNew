/* eslint-disable no-useless-catch */
import axios from 'axios'

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      'http://localhost:4444/api/v1/admins/login',
      JSON.stringify({
        email,
        password,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return response.data.data
  } catch (error) {
    throw error
  }
}
