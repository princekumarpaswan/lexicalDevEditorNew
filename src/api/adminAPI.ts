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
// export const getAllAdminUsers = async () => {
//   try {
//     const accessToken = getAccessToken()
//     const config: AxiosRequestConfig = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }

//     const response = await axios.get(`${BASE_URL}/admins`, config)

//     return response.data
//   } catch (error) {
//     throw error
//   }
// }

export const getAllAdminUsers = async (pageNo: number, limit: number) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(
      `${BASE_URL}/admins?page=${pageNo}&limit=${limit}`,
      config,
    )
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

// API to Edit Admin User
export const updateAdminInfo = async (
  adminId: string,
  payload: {
    newName: string
    newRole: string
    newEmail: string
    newPassword?: string
  },
) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const { newPassword, ...otherPayload } = payload
    const requestPayload = newPassword
      ? { ...otherPayload, newPassword }
      : otherPayload

    const response = await axios.patch(
      `${BASE_URL}/admins/update/info/${adminId}`,
      requestPayload,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}
