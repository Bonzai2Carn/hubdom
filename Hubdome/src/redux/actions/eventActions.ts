// src/redux/actions/eventActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import eventService from "../../services/eventService";
import { handleApiError } from "../../utils/apiUtils";
import { Event } from "../../types/interfaces";

// Action type constants for improved maintainability
export const GET_ALL_EVENTS = "event/getAllEvents";
export const GET_EVENT = "event/getEvent";
export const CREATE_EVENT = "event/createEvent";
export const UPDATE_EVENT = "event/updateEvent";
export const DELETE_EVENT = "event/deleteEvent";
export const JOIN_EVENT = "event/joinEvent";
export const LEAVE_EVENT = "event/leaveEvent";
export const GET_NEARBY_EVENTS = "event/getNearbyEvents";
export const GET_USER_EVENTS = "event/getUserEvents";
export const GET_HOBBY_EVENTS = "event/getHobbyEvents";

// Types for event parameters
interface NearbyEventsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  hobbyType?: string;
}

interface CreateEventData {
  title: string;
  description: string;
  hobbyId: string;
  startDate: string;
  endDate: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    formattedAddress: string;
  };
  capacity?: number;
  isPrivate?: boolean;
  image?: string;
}

interface UpdateEventData {
  id: string;
  eventData: Partial<CreateEventData>;
}

/**
 * Get all events thunk
 * Fetches all events from the API
 */
export const getAllEvents = createAsyncThunk(
  GET_ALL_EVENTS,
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getAllEvents();
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get a single event by ID thunk
 * Fetches detailed event information
 */
export const getEvent = createAsyncThunk(
  GET_EVENT,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await eventService.getEvent(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Create a new event thunk
 * Submits new event data to the API
 */
export const createEvent = createAsyncThunk(
  CREATE_EVENT,
  async (eventData: CreateEventData, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Update an existing event thunk
 * Modifies event details
 */
export const updateEvent = createAsyncThunk(
  UPDATE_EVENT,
  async ({ id, eventData }: UpdateEventData, { rejectWithValue }) => {
    try {
      const response = await eventService.updateEvent(id, eventData);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Delete an event thunk
 * Removes an event from the system
 */
export const deleteEvent = createAsyncThunk(
  DELETE_EVENT,
  async (id: string, { rejectWithValue }) => {
    try {
      await eventService.deleteEvent(id);
      // Return the ID for the reducer to filter it out
      return { id };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Join an event thunk
 * Adds the current user as a participant
 */
export const joinEvent = createAsyncThunk(
  JOIN_EVENT,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await eventService.joinEvent(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Leave an event thunk
 * Removes the current user from participants
 */
export const leaveEvent = createAsyncThunk(
  LEAVE_EVENT,
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await eventService.leaveEvent(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get nearby events thunk
 * Fetches events based on geographic location
 */
export const getNearbyEvents = createAsyncThunk(
  GET_NEARBY_EVENTS,
  async (params: NearbyEventsParams, { rejectWithValue }) => {
    try {
      const response = await eventService.getNearbyEvents(params);
      
      // Transform event data to map markers if needed
      const events = response;
      
      // Return the events with distance information
      return events;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get events for the current user thunk
 * Fetches events the user has joined or created
 */
export const getUserEvents = createAsyncThunk(
  GET_USER_EVENTS,
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getUserEvents();
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);