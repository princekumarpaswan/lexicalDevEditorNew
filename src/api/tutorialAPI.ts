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
export const listAllTutorials = async (skip = 0, limit = 10) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { skip, limit },
    }
    const response = await axios.get(`${BASE_URL}/tutorials/list`, config)
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
