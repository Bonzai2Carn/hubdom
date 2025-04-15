// src/redux/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService, { 
  LoginRequest,
  RegisterRequest,
  SocialAuthRequest
} from '../../services/authService';
import { User } from '../../types/interfaces';
import { ApiError } from '../../services/api';

// State interface
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface NotificationPreferences {
  events: boolean;
  messages: boolean;
  nearbyActivities: boolean;
}

interface OnboardingState {
  hobbies: Record<string, string[]>;
  avatar: string;
  locationPermission: boolean;
  notificationPreferences: NotificationPreferences;
  hasCompletedOnboarding: boolean;
}

// Initial state
const initialState: AuthState & OnboardingState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  hobbies: {},
  avatar: 'explorer',
  locationPermission: false,
  notificationPreferences: {
    events: true,
    messages: true,
    nearbyActivities: true
  },
  hasCompletedOnboarding: false
};

// Async thunks
export const loginUser = createAsyncThunk<
  User,
  LoginRequest,
  { rejectValue: string }
>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      if (!response.user) {
        throw new Error('No user data received');
      }
      return response.user;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed. Please check your credentials."
      );
    }
  }
);

export const registerUser = createAsyncThunk<
  User,
  RegisterRequest,
  { rejectValue: string }
>(
  'auth/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await authService.register(registerData);
      if (!response.user) {
        throw new Error('No user data received');
      }
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Registration failed. Please try again.'
      );
    }
  }
);

export const socialLogin = createAsyncThunk<
  User,
  SocialAuthRequest,
  { rejectValue: string }
>(
  'auth/socialLogin',
  async (socialAuthData, { rejectWithValue }) => {
    try {
      const response = await authService.socialAuth(socialAuthData);
      if (!response.user || !response.user.id) {
        throw new Error('Invalid user data received');
      }
      return response.user as User;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : `${socialAuthData.provider} login failed. Please try again.`
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      if ((error as ApiError).status === 401) {
        await AsyncStorage.removeItem('authToken');
      }
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch user data'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Logout failed'
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    completeOnboarding: (state, action: PayloadAction<{
      hobbies: Record<string, string[]>;
      avatar: string;
      locationPermission: boolean;
      notificationPreferences: NotificationPreferences;
    }>) => {
      state.hobbies = action.payload.hobbies;
      state.avatar = action.payload.avatar;
      state.locationPermission = action.payload.locationPermission;
      state.notificationPreferences = action.payload.notificationPreferences;
      state.hasCompletedOnboarding = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      
      // Social Login
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Social login failed';
      })
      
      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

// Export actions
export const { clearError, setAuthenticated, setUser, completeOnboarding } = authSlice.actions;

// Export reducer
export default authSlice.reducer;