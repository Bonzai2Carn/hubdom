// src/redux/actions/hobbyActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as hobbyService from "../../services/hobbyService";
import { handleApiError } from "../../utils/apiUtils";
import { Hobby } from "../../types/interfaces";

// Action type constants for improved maintainability
export const GET_ALL_HOBBIES = "hobby/getAllHobbies";
export const GET_HOBBY = "hobby/getHobby";
export const CREATE_HOBBY = "hobby/createHobby";
export const UPDATE_HOBBY = "hobby/updateHobby";
export const DELETE_HOBBY = "hobby/deleteHobby";
export const JOIN_HOBBY = "hobby/joinHobby";
export const LEAVE_HOBBY = "hobby/leaveHobby";
export const GET_POPULAR_HOBBIES = "hobby/getPopularHobbies";
export const GET_NEARBY_HOBBIES = "hobby/getNearbyHobbies";

// Types for hobby parameters
interface HobbyData {
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  image?: string | null;
}

interface UpdateHobbyData {
  id: string;
  hobbyData: Partial<HobbyData>;
}

interface NearbyHobbiesParams {
  latitude: number;
  longitude: number;
  radius?: number;
}

/**
 * Get all hobbies thunk
 * Fetches all available hobbies
 */
export const getAllHobbies = createAsyncThunk(
  GET_ALL_HOBBIES,
  async (_, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getAllHobbies();
      return response.data || [];
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get a single hobby by ID thunk
 * Fetches detailed hobby information
 */
export const getHobby = createAsyncThunk(
  GET_HOBBY,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getHobby(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Create a new hobby thunk
 * Submits new hobby data to the API
 */
export const createHobby = createAsyncThunk(
  CREATE_HOBBY,
  async (hobbyData: HobbyData, { rejectWithValue }) => {
    try {
      const response = await hobbyService.createHobby(hobbyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Update an existing hobby thunk
 * Modifies hobby details
 */
export const updateHobby = createAsyncThunk(
  UPDATE_HOBBY,
  async ({ id, hobbyData }: UpdateHobbyData, { rejectWithValue }) => {
    try {
      const response = await hobbyService.updateHobby(id, hobbyData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Delete a hobby thunk
 * Removes a hobby from the system
 */
export const deleteHobby = createAsyncThunk(
  DELETE_HOBBY,
  async (id: string, { rejectWithValue }) => {
    try {
      await hobbyService.deleteHobby(id);
      // Return the ID for the reducer to filter it out
      return { id };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Join a hobby thunk
 * Adds the current user to a hobby
 */
export const joinHobby = createAsyncThunk(
  JOIN_HOBBY,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hobbyService.joinHobby(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Leave a hobby thunk
 * Removes the current user from a hobby
 */
export const leaveHobby = createAsyncThunk(
  LEAVE_HOBBY,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hobbyService.leaveHobby(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get popular hobbies thunk
 * Fetches hobbies sorted by popularity
 */
export const getPopularHobbies = createAsyncThunk(
  GET_POPULAR_HOBBIES,
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getPopularHobbies(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get nearby hobbies thunk
 * Fetches hobbies based on geographic location
 */
export const getNearbyHobbies = createAsyncThunk(
  GET_NEARBY_HOBBIES,
  async (params: NearbyHobbiesParams, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getNearbyHobbies(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Search hobbies by name or tags thunk
 * Provides search functionality for hobbies
 */
export const searchHobbies = createAsyncThunk(
  "hobby/searchHobbies",
  async (query: string, { rejectWithValue, dispatch }) => {
    try {
      // First get all hobbies (or implement a search API endpoint)
      const response = await dispatch(getAllHobbies()).unwrap();
      
      // Filter hobbies that match the search query
      const filteredHobbies = response.filter((hobby: Hobby) => {
        const nameMatch = hobby.name.toLowerCase().includes(query.toLowerCase());
        const tagMatch = hobby.tags?.some(tag => 
          tag.toLowerCase().includes(query.toLowerCase())
        );
        const categoryMatch = hobby.category?.toLowerCase().includes(query.toLowerCase());
        
        return nameMatch || tagMatch || categoryMatch;
      });
      
      return filteredHobbies;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Toggle hobby membership thunk
 * Joins or leaves a hobby based on current status
 */
export const toggleHobbyMembership = createAsyncThunk(
  "hobby/toggleMembership",
  async (hobbyId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      // Get current user from state
      const state = getState() as any;
      const currentUser = state.user.userInfo;
      
      // Check if user is a member of this hobby
      const isMember = currentUser?.hobbies?.includes(hobbyId);
      
      // Perform the appropriate action
      if (isMember) {
        const response = await dispatch(leaveHobby(hobbyId)).unwrap();
        return response;
      } else {
        const response = await dispatch(joinHobby(hobbyId)).unwrap();
        return response;
      }
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);