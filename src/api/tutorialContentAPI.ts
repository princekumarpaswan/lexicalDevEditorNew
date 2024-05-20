/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */

import axios from 'axios'
import { BASE_URL, accessToken } from '../constants/ApiConstant'

//API for fetching all the tutorial content
export const contentTutorial = async (pageNo: number, limit: number) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(
      `${BASE_URL}/subtopics/list?page=${pageNo}&limit=${limit}`,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
})

// api for Filtering The Subtopics
export const FilterSubtopics = async (
  status: any,
  reviewerId: any,
  writerId: any,
) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/subtopics/filter`, {
      params: {
        status,
        reviewerId,
        writerId,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error loading the Data', error)
    throw error
  }
}

// API to list Admis by using Role in Tutorial Content filter
export const GetAdminUsersByRole = async (role: any) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/admins/roles`, {
      params: {
        role,
      },
    })
    return response.data
  } catch (error) {
    console.error('Error loading the Data', error)
    throw error
  }
}
