/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */

import axios from 'axios'
import { BASE_URL } from '../context/AuthContext/AuthContext'

const getAccessToken = () => localStorage.getItem('accessToken')

//API for fetching all the tutorial content
export const contentTutorial = async (pageNo: number, limit: number) => {
  try {
    const accessToken = getAccessToken()
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

export const searchTutorial = async (placeHolder: string) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(
      `${BASE_URL}/tutorials/search?q=${placeHolder}`,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const getTutorialDetail = async (id: string) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(`${BASE_URL}/tutorials/info/${id}`, config)
    return response.data
  } catch (error) {
    throw error
  }
}

export const getAdminBYRoll = async () => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(`${BASE_URL}/admins/`, config)
    return response.data
  } catch (error) {
    throw error
  }
}

export const assignContentWritter = async (
  subTopicId: string,
  payload: string,
) => {
  console.log({ subTopicId, payload })
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.patch(
      `${BASE_URL}/subtopics/assign/writer/${subTopicId}`,
      { writerId: payload },
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// api for Filtering The Subtopics
export const FilterSubtopics = async (
  status: any,
  reviewerId: any,
  writerId: any,
) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        status,
        reviewerId,
        writerId,
      },
    }
    const response = await axios.get(`${BASE_URL}/subtopics/filter`, config)
    return response.data
  } catch (error) {
    console.error('Error loading the Data', error)
    throw error
  }
}

// API to list Admis by using Role in Tutorial Content filter
export const GetAdminUsersByRole = async (role: any) => {
  try {
    const response = await axios.get(`${BASE_URL}/admins/roles?role=${role}`)
    return response.data
  } catch (error) {
    console.error('Error loading the Data', error)
    throw error
  }
}

// API for searching the subtopics by name
export const searchSubTopics = async (query: any) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(
      `${BASE_URL}/subtopics/search?q=${query}`,
      config,
    )
    return response.data
  } catch (error) {
    console.error('Failed to search sub-topics', error)
    throw error
  }
}
