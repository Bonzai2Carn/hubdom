// redux/slices/eventSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as eventService from '../../services/eventService';

// Define the event interface to match our new structure
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  eventType: "public" | "private" | "paid";
  days: number[];
  time: string;
  participants: string[];
  createdAt: string;
  updatedAt?: string;
}

interface EventState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: EventState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  success: false,
};

// Create event thunk
export const createEvent = createAsyncThunk(
  'event/create',
  async (eventData: Partial<Event>, { rejectWithValue }) => {
    try {
      const response = await eventService.createEvent(eventData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { error: "Failed to create event" });
    }
  }
);

// The slice
const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearEventError: (state) => {
      state.error = null;
    },
    clearEventSuccess: (state) => {
      state.success = false;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.loading = false;
        state.success = true;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.error || "Failed to create event";
      });
  },
});

export const { clearEventError, clearEventSuccess, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;