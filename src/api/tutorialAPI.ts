/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import axios, { AxiosRequestConfig } from 'axios'

const BASE_URL = 'http://localhost:4444/api/v1'
const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjkzNTFkZDAxLWRmNjYtNDUyYy1hZjMxLTI3YjBlYmMxZDcxMSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcxNTU5OTY5NywiZXhwIjoxNzE1Njg2MDk3fQ.C4WlR4YB5WjQ6glBD_ixCIROs5zP6_hBr2pUNPBhmJE'

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

