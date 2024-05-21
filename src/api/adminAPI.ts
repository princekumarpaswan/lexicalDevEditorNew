/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-useless-catch */
import axios, { AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../context/AuthContext/AuthContext'

const getAccessToken = () => localStorage.getItem('accessToken')

// Api for creating an Admin user
export const createAdmin = async (
  fullName: string,
  email: string,
  password: string,
  role: 'ADMIN' | 'CONTENT_WRITER' | 'CONTENT_REVIEWER',
) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.post(
      `${BASE_URL}/admins/create`,
      {
        fullName,
        email,
        password,
        role,
      },
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// Api for listing all admin users:
export const getAllAdminUsers = async () => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await axios.get(`${BASE_URL}/admins`, config)

    return response.data
  } catch (error) {
    throw error
  }
}

//Api for Deleting Admin User:
export const deleteAdminUser = async (adminId: string) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await axios.delete(
      `${BASE_URL}/admins/delete/${adminId}`,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// // API  to change password
// export const changePassword = async (userId: string, newPassword: string) => {
//   try {
//     const config: AxiosRequestConfig = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//     const response = await axios.post(
//       `${BASE_URL}/admins/change-password`,
//       { userId, newPassword },
//       config,
//     )
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }

// // API  to change role
// export const changeRole = async (userId: string, newRole: string) => {
//   try {
//     const config: AxiosRequestConfig = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//     const response = await axios.patch(
//       `${BASE_URL}/admins/update/role/${userId}`,
//       { newRole },
//       config,
//     )
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }

// export const updateUser = async (
//   userId: any,
//   actionType: string,
//   newData: any,
// ) => {
//   try {
//     const config: AxiosRequestConfig = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }

//     let url
//     let requestData

//     if (actionType === 'changePassword') {
//       url = `${BASE_URL}/admins/change-password`
//       requestData = { userId, newPassword: newData }
//     } else if (actionType === 'changeRole') {
//       url = `${BASE_URL}/admins/change-role/${userId}` // Added / before userId
//       requestData = { userId, newRole: newData }
//     } else {
//       throw new Error('Invalid actionType')
//     }

//     const response = await axios.patch(url, requestData, config) // Changed from axios.post to axios.patch
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }
