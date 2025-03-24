// mobile/src/services/hobbyService.ts
import API from './api';
import { AxiosResponse } from 'axios';
import { ApiResponse, Hobby } from '../types/interfaces';
import { handleApiError } from '../utils/apiUtils';

/**
 * Get all hobbies
 * @returns {Promise<ApiResponse<Hobby[]>>} Response with hobbies array
 */
export const getAllHobbies = async (): Promise<ApiResponse<Hobby[]>> => {
  try {
    const response = await API.get("/hobbies");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get a single hobby by ID
 * @param {string} id - The hobby ID
 * @returns {Promise<ApiResponse<Hobby>>} Response with single hobby
 */
export const getHobby = async (id: string): Promise<ApiResponse<Hobby>> => {
  try {
    const response = await API.get(`/hobbies/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new hobby
 * @param {Object} hobbyData - The hobby data
 * @returns {Promise<ApiResponse<Hobby>>} Response with created hobby
 */
export const createHobby = async (hobbyData: {
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  image?: string | null;
}): Promise<ApiResponse<Hobby>> => {
  try {
    const response = await API.post("/hobbies", hobbyData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update a hobby
 * @param {string} id - The hobby ID
 * @param {Object} hobbyData - The hobby data to update
 * @returns {Promise<ApiResponse<Hobby>>} Response with updated hobby
 */
export const updateHobby = async (
  id: string,
  hobbyData: {
    name?: string;
    description?: string;
    category?: string;
    tags?: string[];
    image?: string | null;
  }
): Promise<ApiResponse<Hobby>> => {
  try {
    const response = await API.put(`/hobbies/${id}`, hobbyData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a hobby
 * @param {string} id - The hobby ID
 * @returns {Promise<ApiResponse<{}>>} Response with deletion confirmation
 */
export const deleteHobby = async (id: string): Promise<ApiResponse<{}>> => {
  try {
    const response = await API.delete(`/hobbies/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get nearby hobbies based on user location
 * @param {Object} params - Query parameters
 * @returns {Promise<ApiResponse<Hobby[]>>} Response with nearby hobbies
 */
export const getNearbyHobbies = async (params: {
  latitude: number;
  longitude: number;
  radius?: number;
}): Promise<ApiResponse<Hobby[]>> => {
  try {
    const response = await API.get("/hobbies/nearby", { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get popular hobbies
 * @param {number} [limit=10] - Number of hobbies to return
 * @returns {Promise<ApiResponse<Hobby[]>>} Response with popular hobbies
 */
export const getPopularHobbies = async (
  limit: number = 10
): Promise<ApiResponse<Hobby[]>> => {
  try {
    const response = await API.get("/hobbies/popular", { params: { limit } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Join a hobby
 * @param {string} id - The hobby ID
 * @returns {Promise<ApiResponse<Hobby>>} Response with updated hobby
 */
export const joinHobby = async (id: string): Promise<ApiResponse<Hobby>> => {
  try {
    const response = await API.post(`/hobbies/${id}/join`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Leave a hobby
 * @param {string} id - The hobby ID
 * @returns {Promise<ApiResponse<Hobby>>} Response with updated hobby
 */
export const leaveHobby = async (id: string): Promise<ApiResponse<Hobby>> => {
  try {
    const response = await API.post(`/hobbies/${id}/leave`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};