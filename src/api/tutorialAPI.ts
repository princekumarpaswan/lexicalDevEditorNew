/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */

import axios, { AxiosRequestConfig } from 'axios'
import { BASE_URL, accessToken } from '../constants/ApiConstant'

// Api for Create tutorial
export const createTutorial = async (tutorialData: any) => {
  try {
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
// API for listing all tutorials
export const listAllTutorials = async (page = 1, limit = 10) => {
  try {
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

// Api for Search Tutorial using Tutorial Name
export const searchTutorials = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/tutorials/search?q=${query}`)
    return response.data
  } catch (error) {
    console.error('Failed to search tutorials', error)
    throw error
  }
}

// Api for Filter Tutorials
interface FilterParams {
  categoryId?: string
  status?: string
}
export const filterTutorials = async ({ categoryId, status }: FilterParams) => {
  let url = `${BASE_URL}/tutorials/filter`

  if (categoryId && status) {
    url = `${url}/?categoryId=${categoryId}&status=${status}`
    console.log('both url', url)
  } else if (categoryId && !status) {
    url = `${url}/?categoryId=${categoryId}`
    console.log('only category', url)
  } else if (!categoryId && status) {
    url = `${url}/?status=${status}`
    console.log('only status', url)
  }

  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.error('Failed to fetch filtered tutorials', error)
    throw error
  }
}

// Api for Updating Tutorial Status (LISTED / DELISTED)
export const updateTutorialStatus = async (
  id: string,
  newStatus: 'LISTED' | 'DELISTED',
  accessToken: string,
) => {
  try {
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
export const getTutorialDetails = async (tutorialId: any, accessToken: any) => {
  try {
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

export const updateTopicInfo = async (
  accessToken: string,
  { topicId, newTopicName, newTopicDescription }: UpdateTopicRequest,
) => {
  try {
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

export const updateSubTopicInfo = async (
  accessToken: string,
  {
    subTopicId,
    newSubTopicName,
    newSubTopicDescription,
  }: UpdateSubTopicRequest,
) => {
  try {
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

// API to Delete Sub-topic :
export const deleteSubTopicInfo = async (
  accessToken: string,
  subTopicId: string,
) => {
  try {
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
export const deleteTopicInfo = async (accessToken: string, topicId: string) => {
  try {
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
  token: string,
  tutorialId: string,
  {
    topicName,
    topicDescription,
  }: { topicName: string; topicDescription: string },
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/topics/create/${tutorialId}`,
      { topicName, topicDescription },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.data
  } catch (error) {
    console.error('Error creating topic:', error)
    throw error
  }
}
