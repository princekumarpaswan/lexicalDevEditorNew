/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */

import axios from 'axios'
import { BASE_URL, accessToken } from '../constants/ApiConstant'

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

 