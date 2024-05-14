/* eslint-disable no-useless-catch */
import axios, { AxiosRequestConfig } from 'axios'

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzNTFkZDAxLWRmNjYtNDUyYy1hZjMxLTI3YjBlYmMxZDcxMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcxNTU5OTY5NywiZXhwIjoxNzE1Njg2MDk3fQ.C4WlR4YB5WjQ6glBD_ixCIROs5zP6_hBr2pUNPBhmJE'

const BASE_URL = `http://localhost:4444/api/v1`

// API for creating a category
export const createCategory = async (categoryName: string) => {
  try {
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
