/* eslint-disable @typescript-eslint/no-unused-vars */
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
export const FilterSubtopics = async (params: {
  [key: string]: string | undefined
}) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
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

// API to Generate content using AI
export const createTopicsAndSubTopicsAI = async (payload: any) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }

    const response = await axios.post(
      `${BASE_URL}/tutorials/ai/create`,
      payload,
      config,
    )
    return response.data
  } catch (error) {
    console.error('Error creating topics and subtopics:', error)
    throw error
  }
}
export const getTopicsAndSubTopicsAI = async (id: any) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await axios.get(
      `${BASE_URL}/tutorials/ai/data/${id}`,
      config,
    )
    return response.data
  } catch (error) {
    console.error('Error fetching topics and subtopics:', error)
    throw error
  }
}

/// file input
export const uploadFile = async (file: File) => {
  const accessToken = getAccessToken()
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await axios.post(
      `${BASE_URL}/upload/file`,
      formData,
      config,
    )
    return response.data
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export const createTopicsAndSubTopicsFileUploadAI = async (fileId: string) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const payload = { fileId }

    // Logging payload to ensure it's correct
    console.log('Sending payload:', payload)

    const response = await axios.post(
      `${BASE_URL}/tutorials/ai/create/file`,
      payload,
      config,
    )

    // Logging the response to debug
    console.log('Response:', response.data)

    return response.data
  } catch (error) {
    console.error('Error creating topics and subtopics:')
    throw error
  }
}

export const getTopicsAndSubTopicsFileUploadAI = async (id: string) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(
      `${BASE_URL}/tutorials/ai/get/${id}`,
      config,
    )
    return response.data
  } catch (error) {
    console.error('Error fetching topics and subtopics:', error)
    throw error
  }
}

// API to update the Subtopic Status
export const updateSubtopicStatus = async (
  id: string,
  newSubTopicStatus: string,
  newContent?: string
) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.patch(
      `${BASE_URL}/subtopics/update/status/${id}`,
      { newSubTopicStatus, newContent },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error updating subtopic status:', error)
    throw error
  }
}

export const getCommentFromApi = async (id: string | null) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(
      `${BASE_URL}/subtopics/thread/${id}`,
      config,
    )
    return response.data
  } catch (error) {
    console.error('Error fetching topics and subtopics:', error)
    throw error
  }
}

export const submitCommentApi = async (comments: any, id: string | null) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }

    const response = await axios.post(
      `${BASE_URL}/subtopics/comment/${id}`,
      { comments: comments },
      config,
    )
    return response.data
  } catch (error) {
    console.error('Error creating topics and subtopics:', error)
    throw error
  }
}

export const writeContent = async (
  subTopicId: string | undefined,
  payload: string | null | undefined,
) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.patch(
      `${BASE_URL}/subtopics/update/content/${subTopicId}`,
      { content: payload },
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

export const getWritterContent = async (id: string | null | undefined) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.get(`${BASE_URL}/subtopics/info/${id}`, config)
    return response.data
  } catch (error) {
    console.error('Error fetching topics and subtopics:', error)
    throw error
  }
}

// API for Assign Content Reviewer
export const assignReviewer = async (
  subtopicId: string,
  reviewerId: string,
) => {
  const accessToken = getAccessToken()

  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }

  const payload = {
    reviewerId,
  }

  try {
    const response = await axios.patch(
      `${BASE_URL}/subtopics/assign/reviewer/${subtopicId}`,
      payload,
      config,
    )
    return response.data
  } catch (error) {
    console.error('Error assigning reviewer:', error)
    throw error
  }
}
