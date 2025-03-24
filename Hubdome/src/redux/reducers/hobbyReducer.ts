import { createSlice } from "@reduxjs/toolkit";
import { getAllHobbies, getHobby, createHobby } from "../actions/hobbyActions";

interface Hobby {
  id: string;
  name: string;
  description: string;
  category?: string;
  tags?: string[];
  image?: string;
}

interface HobbyState {
  hobbies: any[];
  hobby: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: HobbyState = {
  hobbies: [],
  hobby: null,
  loading: false,
  error: null,
};

const hobbySlice = createSlice({
  name: "hobby",
  initialState,
  reducers: {
    clearHobbyError: (state) => {
      state.error = null;
    },
    clearHobby: (state) => {
      state.hobby = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all hobbies
      .addCase(getAllHobbies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllHobbies.fulfilled, (state, action) => {
        state.loading = false;
        state.hobbies = action.payload || [];
      })
      .addCase(getAllHobbies.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch hobbies";
      })

      // Get hobby by ID
      .addCase(getHobby.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHobby.fulfilled, (state, action) => {
        state.loading = false;
        state.hobby = action.payload;
      })
      .addCase(getHobby.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch hobby";
      })

      // Create hobby
      .addCase(createHobby.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHobby.fulfilled, (state, action) => {
        state.loading = false;
        state.hobby = action.payload;
        state.hobbies = [...state.hobbies, action.payload];
      })
      .addCase(createHobby.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to create hobby";
      });
  },
});

export const { clearHobbyError, clearHobby } = hobbySlice.actions;

export default hobbySlice.reducer;
