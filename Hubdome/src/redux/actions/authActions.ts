// src/redux/actions/authActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authService from "../../services/authService";
import { User } from "../../types/interfaces";

// Constants for storage keys
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

// Type definitions
interface LoginCredentials {
  email?: string; 
  username?: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  username: string;
  password: string;
}

interface SocialAuthCredentials {
  provider: 'google' | 'facebook' | 'twitter';
  token: string;
  isRegistration?: boolean;
  email?: string;
  name?: string;
}

/**
 * Login user thunk
 * Handles authentication, token storage, and user data
 */
export const loginUser = createAsyncThunk<
  User,                   // Return type
  LoginCredentials,       // Arg type
  { rejectValue: string } // ThunkAPI configuration with typed rejectValue
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Call auth service to login
      const response = await authService.login(credentials);
      
      // Store tokens in AsyncStorage for persistence
      if (response.tokens?.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.tokens.token);
        
        // Store refresh token if available
        if (response.tokens.refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
        }
        
        // Store user data
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response.user;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : "Login failed. Please check your credentials."
      );
    }
  }
);

/**
 * Register user thunk
 * Creates a new account, stores authentication data, and returns user
 */
export const registerUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Call auth service to register
      const response = await authService.register(userData);
      
      // Store tokens in AsyncStorage for persistence
      if (response.tokens?.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.tokens.token);
        
        // Store refresh token if available
        if (response.tokens.refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
        }
        
        // Store user data
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response.user;
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : "Registration failed. Please try again."
      );
    }
  }
);

/**
 * Social login/registration thunk
 * Handles OAuth authentication with various providers
 */
export const socialLogin = createAsyncThunk<
  User,
  SocialAuthCredentials,
  { rejectValue: string }
>(
  "auth/socialLogin",
  async (socialData, { rejectWithValue }) => {
    try {
      // Call auth service for social authentication
      const response = await authService.socialAuth(socialData);
      
      // Store tokens in AsyncStorage for persistence
      if (response.tokens?.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.tokens.token);
        
        // Store refresh token if available
        if (response.tokens.refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
        }
        
        // Store user data
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      
      return response.user;
    } catch (error) {
      console.error(`${socialData.provider} auth error:`, error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : `${socialData.provider} authentication failed. Please try again.`
      );
    }
  }
);

/**
 * Fetch current user thunk
 * Gets the authenticated user based on stored token
 */
export const fetchCurrentUser = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Check if we have a token
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!token) {
        // No token found, user is not authenticated
        return null;
      }

      console.log('Auth token found in storage, attempting to get user data');

      // First try to get user from AsyncStorage to avoid unnecessary API calls
      const cachedUser = await AsyncStorage.getItem(USER_KEY);
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser);
          // If we have a valid user object, return it
          if (parsedUser && parsedUser.id) {
            return parsedUser;
          }
        } catch (parseError) {
          // If parsing fails, continue to API call
          console.warn("Error parsing cached user:", parseError);
        }
      }
      
      console.log('Getting current user from API');
      // Get current user from the API
      const user = await authService.getCurrentUser();
      
      console.log('API response for current user:', user);

      // Update cached user data if successful
      if (user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      // If token is invalid, remove it
      if (error instanceof Error && error.message.includes('401')) {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
      }
      
      console.error("Error fetching current user:", error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : "Failed to authenticate. Please log in again."
      );
    }
  }
);

/**
 * Logout user thunk
 * Clears authentication data and state
 */
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Attempt to logout on the server
      try {
        await authService.logout();
      } catch (logoutError) {
        // Even if server logout fails, continue with client-side logout
        console.warn("Server logout failed, proceeding with client-side logout:", logoutError);
      }
      
      // Remove all auth data from storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      
      // Successfully logged out
      return;
    } catch (error) {
      console.error("Error during logout:", error);
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : "Logout failed. Please try again."
      );
    }
  }
);

/**
 * Refresh auth token thunk
 * Gets a new token using the refresh token
 */
export const refreshToken = createAsyncThunk<
  { token: string; refreshToken?: string },
  void,
  { rejectValue: string }
>(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      // Get stored refresh token
      const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!storedRefreshToken) {
        throw new Error("No refresh token available");
      }
      
      // Call auth service to get new tokens
      const response = await authService.refreshToken(storedRefreshToken);
      
      // Transform and store new tokens (access via response.tokens)
      if (response.tokens?.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.tokens.token);
        
        if (response.tokens.refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
        }
        
        return { token: response.tokens.token, refreshToken: response.tokens.refreshToken };
      } else {
        throw new Error("Invalid tokens response");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      
      // Clear tokens on failure
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      
      return rejectWithValue(
        error instanceof Error 
          ? error.message 
          : "Authentication expired. Please login again."
      );
    }
  }
);