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

export const searchTutorial = async (placeHolder: string) => {
  try {
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

export const assignContentWritter = async (subTopicId: string, payload: string) => {
  console.log({subTopicId, payload});
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axios.patch(
      `${BASE_URL}/subtopics/assign/writer/${subTopicId}`,
      {"writerId": payload}, 
      config
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
