// mobile/src/redux/slices/hobbySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as hobbyService from '../../services/hobbyService';
import { RootState } from '../store';
import { Hobby } from '../../types/interfaces';

// Define HobbyState interface
interface HobbyState {
  hobbies: Hobby[];
  popularHobbies: Hobby[];
  nearbyHobbies: Hobby[];
  currentHobby: Hobby | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialState: HobbyState = {
  hobbies: [],
  popularHobbies: [],
  nearbyHobbies: [],
  currentHobby: null,
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const fetchHobbies = createAsyncThunk(
  'hobby/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getAllHobbies();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to fetch hobbies');
    }
  }
);

export const fetchPopularHobbies = createAsyncThunk(
  'hobby/fetchPopular',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getPopularHobbies(limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to fetch popular hobbies');
    }
  }
);

export const fetchNearbyHobbies = createAsyncThunk(
  'hobby/fetchNearby',
  async (params: { latitude: number; longitude: number; radius?: number }, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getNearbyHobbies(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to fetch nearby hobbies');
    }
  }
);

export const fetchHobbyById = createAsyncThunk(
  'hobby/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hobbyService.getHobby(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to fetch hobby');
    }
  }
);

export const createHobby = createAsyncThunk(
  'hobby/create',
  async (hobbyData: { 
    name: string; 
    description: string; 
    category?: string; 
    tags?: string[]; 
    image?: string | null 
  }, { rejectWithValue }) => {
    try {
      const response = await hobbyService.createHobby(hobbyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to create hobby');
    }
  }
);

export const updateHobby = createAsyncThunk(
  'hobby/update',
  async ({ 
    id, 
    hobbyData 
  }: { 
    id: string; 
    hobbyData: { 
      name?: string; 
      description?: string; 
      category?: string; 
      tags?: string[]; 
      image?: string | null 
    } 
  }, { rejectWithValue }) => {
    try {
      const response = await hobbyService.updateHobby(id, hobbyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to update hobby');
    }
  }
);

export const deleteHobby = createAsyncThunk(
  'hobby/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await hobbyService.deleteHobby(id);
      return { id };
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to delete hobby');
    }
  }
);

export const joinHobby = createAsyncThunk(
  'hobby/join',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hobbyService.joinHobby(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to join hobby');
    }
  }
);

export const leaveHobby = createAsyncThunk(
  'hobby/leave',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await hobbyService.leaveHobby(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.error || 'Failed to leave hobby');
    }
  }
);

// Create the slice
const hobbySlice = createSlice({
  name: 'hobby',
  initialState,
  reducers: {
    clearHobbyError: (state) => {
      state.error = null;
    },
    clearHobbySuccess: (state) => {
      state.success = false;
    },
    clearCurrentHobby: (state) => {
      state.currentHobby = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all hobbies
      .addCase(fetchHobbies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHobbies.fulfilled, (state, action: PayloadAction<Hobby[]>) => {
        state.loading = false;
        state.hobbies = action.payload;
      })
      .addCase(fetchHobbies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

      // Fetch popular hobbies
      .addCase(fetchPopularHobbies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularHobbies.fulfilled, (state, action: PayloadAction<Hobby[]>) => {
        state.loading = false;
        state.popularHobbies = action.payload;
      })
      .addCase(fetchPopularHobbies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })
      
      // Fetch nearby hobbies
      .addCase(fetchNearbyHobbies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyHobbies.fulfilled, (state, action: PayloadAction<Hobby[]>) => {
        state.loading = false;
        state.nearbyHobbies = action.payload;
      })
      .addCase(fetchNearbyHobbies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

      // Fetch hobby by ID
      .addCase(fetchHobbyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHobbyById.fulfilled, (state, action: PayloadAction<Hobby>) => {
        state.loading = false;
        state.currentHobby = action.payload;
      })
      .addCase(fetchHobbyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

      // Create hobby
      .addCase(createHobby.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createHobby.fulfilled, (state, action: PayloadAction<Hobby>) => {
        state.loading = false;
        state.success = true;
        state.hobbies.push(action.payload);
        state.currentHobby = action.payload;
      })
      .addCase(createHobby.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

      // Update hobby
      .addCase(updateHobby.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateHobby.fulfilled, (state, action: PayloadAction<Hobby>) => {
        state.loading = false;
        state.success = true;
        
        // Update hobby in all arrays
        const updateHobbyInArray = (hobbies: Hobby[]) => {
          const index = hobbies.findIndex((h) => h.id === action.payload.id);
          if (index !== -1) {
            hobbies[index] = action.payload;
          }
          return hobbies;
        };
        
        state.hobbies = updateHobbyInArray(state.hobbies);
        state.popularHobbies = updateHobbyInArray(state.popularHobbies);
        state.nearbyHobbies = updateHobbyInArray(state.nearbyHobbies);
        
        // Update current hobby if it matches
        if (state.currentHobby?.id === action.payload.id) {
          state.currentHobby = action.payload;
        }
      })
      .addCase(updateHobby.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

      // Delete hobby
      .addCase(deleteHobby.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteHobby.fulfilled, (state, action: PayloadAction<{ id: string }>) => {
        state.loading = false;
        state.success = true;
        
        // Remove hobby from all arrays
        const removeHobbyFromArray = (hobbies: Hobby[]) => {
          return hobbies.filter((h) => h.id !== action.payload.id);
        };
        
        state.hobbies = removeHobbyFromArray(state.hobbies);
        state.popularHobbies = removeHobbyFromArray(state.popularHobbies);
        state.nearbyHobbies = removeHobbyFromArray(state.nearbyHobbies);
        
        // Clear current hobby if it matches
        if (state.currentHobby?.id === action.payload.id) {
          state.currentHobby = null;
        }
      })
      .addCase(deleteHobby.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

      // Join hobby
      .addCase(joinHobby.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinHobby.fulfilled, (state, action: PayloadAction<Hobby>) => {
        state.loading = false;
        
        // Update hobby in all arrays
        const updateHobbyInArray = (hobbies: Hobby[]) => {
          const index = hobbies.findIndex((h) => h.id === action.payload.id);
          if (index !== -1) {
            hobbies[index] = action.payload;
          }
          return hobbies;
        };
        
        state.hobbies = updateHobbyInArray(state.hobbies);
        state.popularHobbies = updateHobbyInArray(state.popularHobbies);
        state.nearbyHobbies = updateHobbyInArray(state.nearbyHobbies);
        
        // Update current hobby if it matches
        if (state.currentHobby?.id === action.payload.id) {
          state.currentHobby = action.payload;
        }
      })
      .addCase(joinHobby.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      })

      // Leave hobby
      .addCase(leaveHobby.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveHobby.fulfilled, (state, action: PayloadAction<Hobby>) => {
        state.loading = false;
        
        // Update hobby in all arrays
        const updateHobbyInArray = (hobbies: Hobby[]) => {
          const index = hobbies.findIndex((h) => h.id === action.payload.id);
          if (index !== -1) {
            hobbies[index] = action.payload;
          }
          return hobbies;
        };
        
        state.hobbies = updateHobbyInArray(state.hobbies);
        state.popularHobbies = updateHobbyInArray(state.popularHobbies);
        state.nearbyHobbies = updateHobbyInArray(state.nearbyHobbies);
        
        // Update current hobby if it matches
        if (state.currentHobby?.id === action.payload.id) {
          state.currentHobby = action.payload;
        }
      })
      .addCase(leaveHobby.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'An error occurred';
      });
  },
});

// Export actions
export const { 
  clearHobbyError, 
  clearHobbySuccess, 
  clearCurrentHobby 
} = hobbySlice.actions;

// Export selectors
export const selectAllHobbies = (state: RootState) => state.hobby.hobbies;
export const selectPopularHobbies = (state: RootState) => state.hobby.popularHobbies;
export const selectNearbyHobbies = (state: RootState) => state.hobby.nearbyHobbies;
export const selectCurrentHobby = (state: RootState) => state.hobby.currentHobby;
export const selectHobbyLoading = (state: RootState) => state.hobby.loading;
export const selectHobbyError = (state: RootState) => state.hobby.error;
export const selectHobbySuccess = (state: RootState) => state.hobby.success;

export default hobbySlice.reducer;