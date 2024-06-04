/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable no-useless-catch */
import axios, { AxiosRequestConfig } from 'axios'
import { BASE_URL } from '../context/AuthContext/AuthContext'

const getAccessToken = () => localStorage.getItem('accessToken')

// API for creating a category
export const createCategory = async (categoryName: string) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.post(
      `${BASE_URL}/categories/create`,
      {
        categoryName,
      },
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// API for listing all categories
interface CategoryResponse {
  data: any[]
  page: any
  limit: any
}

export const getAllCategories = async (page = 1, limit = 10) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    const response = await axios.get<CategoryResponse>(
      `${BASE_URL}/categories?page=${page}&limit=${limit}`,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}
// export const getAllCategories = async () => {
//   try {
//     const accessToken = getAccessToken()
//     const config: AxiosRequestConfig = {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }

//     const response = await axios.get(`${BASE_URL}/categories`, config)
//     return response.data
//   } catch (error) {
//     throw error
//   }
// }

// Api for update category name
export const updateCategory = async (
  categoryId: string,
  newCategoryName: string,
) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.patch(
      `${BASE_URL}/categories/update/${categoryId}`,
      { newCategoryName: newCategoryName },
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

// Api for deleting a category
export const deleteCategory = async (categoryId: string) => {
  try {
    const accessToken = getAccessToken()
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    const response = await axios.delete(
      `${BASE_URL}/categories/delete/${categoryId}`,
      config,
    )
    return response.data
  } catch (error) {
    throw error
  }
}

//API for searching the Categories
export const searchCategories = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/categories/search`, {
      params: { q: query },
    })

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error searching categories:', error)
    throw error
  }
}
