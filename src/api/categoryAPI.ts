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
