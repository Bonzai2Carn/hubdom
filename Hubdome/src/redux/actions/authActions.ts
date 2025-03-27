// src/redux/actions/authActions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { User } from "../../types/interfaces";

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
  isRegistration?: boolean; // Add this property
  email?: string;
  name?: string;
}

/**
 * Login user thunk
 */
export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: { error: string } }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Call auth service to login
      const response = await authService.login(credentials);
      return response.user;
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue({ 
        error: error instanceof Error 
          ? error.message 
          : "Login failed. Please check your credentials."
      });
    }
  }
);

/**
 * Register user thunk
 */
export const registerUser = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: { error: string } }
>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      // Call auth service to register
      const response = await authService.register(userData);
      return response.user;
    } catch (error) {
      console.error("Registration error:", error);
      return rejectWithValue({ 
        error: error instanceof Error 
          ? error.message 
          : "Registration failed. Please try again."
      });
    }
  }
);

/**
 * Social login/registration thunk
 */
export const socialLogin = createAsyncThunk<
  User,
  SocialAuthCredentials,
  { rejectValue: { error: string } }
>(
  "auth/socialLogin",
  async (socialData, { rejectWithValue }) => {
    try {
      // Call auth service for social authentication
      const response = await authService.socialAuth(socialData);
      return response.user;
    } catch (error) {
      console.error(`${socialData.provider} auth error:`, error);
      return rejectWithValue({
        error: error instanceof Error 
          ? error.message 
          : `${socialData.provider} authentication failed. Please try again.`
      });
    }
  }
);

/**
 * Fetch current user thunk
 */
export const fetchCurrentUser = createAsyncThunk<
  User | null,
  void,
  { rejectValue: { error: string } }
>(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Get current user from the API
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return rejectWithValue({
        error: error instanceof Error 
          ? error.message 
          : "Failed to authenticate. Please log in again."
      });
    }
  }
);

/**
 * Logout user thunk
 */
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { error: string } }
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Error during logout:", error);
      return rejectWithValue({
        error: error instanceof Error 
          ? error.message 
          : "Logout failed. Please try again."
      });
    }
  }
);