/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */

import axios, { AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../context/AuthContext/AuthContext'

const getAccessToken = (): string => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    throw new Error('Access token not found')
  }
  return token
}

// Api for Create tutorial
export const createTutorial = async (tutorialData: any) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.post(
      `${BASE_URL}/tutorials/create`,
      tutorialData,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// API for listing all categories
export const getAllCategories = async () => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await axios.get(`${BASE_URL}/categories`, config)
    return response.data
  } catch (error) {
    throw error
  }
}

// API for creating Topic and SubTopics
export const createTopicsAndSubTopics = async (tutorialData: any) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.post(
      `${BASE_URL}/tutorials/create/content`,
      { tutorialData },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating topics and subtopics:', error)
    throw error
  }
}

// API for listing all tutorials
export const listAllTutorials = async (page = 1, limit = 10) => {
  try {
    const accessToken = getAccessToken()
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await axios.get(
      `${BASE_URL}/tutorials/list?page=${page}&limit=${limit}`,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

interface SearchTutorialsResponse {
  data: {
    map(arg0: (tutorial: { tutorialName: any; id: any; categoryName: any; status: any }) => { tutorialName: any; SNo: number; ID: any; categoryName: any; status: any }): unknown
    tutorials: {
      tutorialName: string
      id: string
      categoryName: string
      status: string
    }[]
    totalPages: number
    currentPage: number
  }
  success: boolean
}

export const searchTutorials = async (
  query: string,
  page: number,
  limit: number,
): Promise<SearchTutorialsResponse> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/tutorials/search?q=${query}&page=${page}&limit=${limit}`,
    )
    return response.data
  } catch (error) {
    console.error('Failed to search tutorials', error)
    throw error
  }
}

// Api for Search Tutorial using Tutorial Name
// export const searchTutorials = async (query: string) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/tutorials/search?q=${query}`)
//     return response.data
//   } catch (error) {
//     console.error('Failed to search tutorials', error)
//     throw error
//   }
// }

//
//
//
interface FilterParams {
  categoryId?: any
  status?: any
  page?: number
  limit?: number
}

export const filterTutorials = async ({
  categoryId,
  status,
  page = 1,
  limit = 10,
}: FilterParams) => {
  let url = `${BASE_URL}/tutorials/filter`

  if (categoryId && status) {
    url = `${url}/?categoryId=${categoryId}&status=${status}&page=${page}&limit=${limit}`
    console.log('both url', url)
  } else if (categoryId && !status) {
    url = `${url}/?categoryId=${categoryId}&page=${page}&limit=${limit}`
    console.log('only category', url)
  } else if (!categoryId && status) {
    url = `${url}/?status=${status}&page=${page}&limit=${limit}`
    console.log('only status', url)
  } else {
    url = `${url}/?page=${page}&limit=${limit}`
    console.log('no filter', url)
  }

  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Failed to fetch filtered tutorials', error)
    throw error
  }
}

// Api for Filter Tutorials
// interface FilterParams {
//   categoryId?: string
//   status?: string
// }
// export const filterTutorials = async ({ categoryId, status }: FilterParams) => {
//   let url = `${BASE_URL}/tutorials/filter`

//   if (categoryId && status) {
//     url = `${url}/?categoryId=${categoryId}&status=${status}`
//     console.log('both url', url)
//   } else if (categoryId && !status) {
//     url = `${url}/?categoryId=${categoryId}`
//     console.log('only category', url)
//   } else if (!categoryId && status) {
//     url = `${url}/?status=${status}`
//     console.log('only status', url)
//   }

//   try {
//     const response = await axios.get(url)
//     return response.data
//   } catch (error) {
//     console.error('Failed to fetch filtered tutorials', error)
//     throw error
//   }
// }

// Api for Updating Tutorial Status (LISTED / DELISTED)
export const updateTutorialStatus = async (
  id: string,
  newStatus: 'LISTED' | 'DELISTED',
) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.patch(
      `${BASE_URL}/tutorials/update/status/${id}`,
      { newStatus },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error updating tutorial status:', error)
    throw error
  }
}

// API for Fetching Tutorial Details
export const getTutorialDetails = async (tutorialId: any) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.get(
      `${BASE_URL}/tutorials/info/${tutorialId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error fetching tutorial details:', error)
    throw error
  }
}

// API for updating Tutorial Information
export const updateTutorialInfo = async (
  tutorialId: string,
  newTutorialName: string,
  newTutorialDescription: string,
  newCategoryId: string,
) => {
  const url = `${BASE_URL}/tutorials/update/info/${tutorialId}`

  try {
    const accessToken = getAccessToken()
    const response = await axios.patch(
      url,
      { newTutorialName, newTutorialDescription, newCategoryId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error updating tutorial info:', error)
    throw error
  }
}

// API for Updating Topic :
interface UpdateTopicRequest {
  topicId: string
  newTopicName: string
  newTopicDescription: string
}

export const updateTopicInfo = async ({
  topicId,
  newTopicName,
  newTopicDescription,
}: UpdateTopicRequest) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.patch(
      `${BASE_URL}/topics/update/name/${topicId}`,
      {
        newTopicName,
        newTopicDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error updating topic info:', error)
    throw error
  }
}

// API for updating Sub-Topics:
interface UpdateSubTopicRequest {
  subTopicId: string
  newSubTopicName: string
  newSubTopicDescription: string
}

export const updateSubTopicInfo = async ({
  subTopicId,
  newSubTopicName,
  newSubTopicDescription,
}: UpdateSubTopicRequest) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.patch(
      `${BASE_URL}/subtopics/update/info/${subTopicId}`,
      {
        newSubTopicName,
        newSubTopicDescription,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error updating sub-topic info:', error)
    throw error
  }
}

// API for deleting a Tutorial
export const deleteTutorialInfo = async (tutorialId: string) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.delete(
      `${BASE_URL}/tutorials/delete/${tutorialId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error deleting tutorial info:', error)
    throw error
  }
}

// API to Delete Sub-topic :
export const deleteSubTopicInfo = async (subTopicId: string) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.delete(
      `${BASE_URL}/subtopics/delete/${subTopicId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error deleting sub-topic info:', error)
    throw error
  }
}

// API to delete Topic :
export const deleteTopicInfo = async (topicId: string) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.delete(
      `${BASE_URL}/topics/delete/${topicId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error deleting topic info:', error)
    throw error
  }
}

// APi to add a SubTopic while Editing tutorial
export const createSubTopicInfo = async (
  token: string,
  topicId: string,
  {
    subTopicName,
    subTopicDescription,
  }: { subTopicName: string; subTopicDescription: string },
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/subtopics/create/${topicId}`,
      { subTopicName, subTopicDescription },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating sub-topic:', error)
    throw error
  }
}

// API for adding new Topic while Editing Tutorial
export const createTopicInfo = async (
  tutorialId: string,
  {
    topicName,
    topicDescription,
  }: { topicName: string; topicDescription: string },
) => {
  try {
    const accessToken = getAccessToken()
    const response = await axios.post(
      `${BASE_URL}/topics/create/${tutorialId}`,
      { topicName, topicDescription },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating topic:', error)
    throw error
  }
}

// API for generating the Description if topic and Subtopic
export const generateDescription = async (name: string) => {
  try {
    const accessToken = getAccessToken()

    const response = await axios.post(
      `${BASE_URL}/tutorials/generate/description`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error generating description:', error)
    throw error
  }
}
