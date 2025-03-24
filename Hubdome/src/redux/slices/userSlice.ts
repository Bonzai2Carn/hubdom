// Create file: mobile/src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for the user state
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface UserState {
  userInfo: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  userInfo: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Create the slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Add your reducers here
    setUser: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  },
  // You can add extraReducers for async thunks later
});

// Export actions and reducer
export const { setUser, clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;