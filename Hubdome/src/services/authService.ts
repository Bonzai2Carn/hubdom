// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './api';
import { User } from '../types/interfaces';

// Storage keys
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Auth response interface - matching the backend structure
 */
export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    tokens: {
      token: string;
      refreshToken?: string;
    };
  };
  message?: string;
}

/**
 * Login request
 */
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

/**
 * Register request
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

/**
 * Social auth request
 */
export interface SocialAuthRequest {
  provider: 'google' | 'facebook' | 'twitter';
  token: string;
  email?: string;
  name?: string;
}

/**
 * Auth service for handling authentication
 */
class AuthService {
  /**
   * Login with email/username and password
   */
  public async login(loginData: LoginRequest): Promise<{user: User, tokens: {token: string, refreshToken?: string}}> {
    try {
      const response = await API.post<{user: User, tokens: {token: string, refreshToken?: string}}>('/auth/login', loginData);
      
      // Save auth data
      await this.saveAuthData(response);
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Register a new user
   */
  public async register(registerData: RegisterRequest): Promise<{user: User, tokens: {token: string, refreshToken?: string}}> {
    try {
      // Using any here to handle potential different response structures
      const response = await API.post<any>('/auth/register', registerData);
      
      // Extract user and tokens, regardless of whether they're in data property or at the root
      const result = {
        user: response.user || (response.data ? response.data.user : null),
        tokens: response.tokens || (response.data ? response.data.tokens : null)
      };
      
      if (!result.user || !result.tokens) {
        throw new Error('Invalid response format from server');
      }
      
      // Save auth data
      await this.saveAuthData(result);
      
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Authenticate with social provider
   */
  public async socialAuth(socialAuthData: SocialAuthRequest): Promise<{user: User, tokens: {token: string, refreshToken?: string}}> {
    try {
      const response = await API.post<{user: User, tokens: {token: string, refreshToken?: string}}>('/auth/social', socialAuthData);
      
      // Save auth data
      await this.saveAuthData(response);
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Get current user data
   */
  public async getCurrentUser(): Promise<User | null> {
    try {
      // Check if we have a token
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return null;

      // First try to get from local storage to avoid unnecessary API calls
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        try {
          const parsedUser = JSON.parse(userJson);
          // If we have a valid user object, return it
          if (parsedUser && parsedUser.id) {
            return parsedUser;
          }
        } catch (parseError) {
          console.warn("Error parsing cached user:", parseError);
        }
      }

      // Fetch user from API
      const user = await API.get<User>('/auth/me');
      
      if (user) {
        // Save user data
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }
  
  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      // Try to call logout on the server
      try {
        await API.post('/auth/logout');
      } catch (error) {
        // Continue with client-side logout even if server logout fails
        console.warn('Server logout failed, proceeding with client-side logout');
      }

      // Clear local storage
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }
  
  /**
   * Check if user is authenticated
   */
  public async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      return !!token;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }
  
  /**
   * Save authentication data
   */
  // private async saveAuthData(authResponse: any): Promise<void> {
  //   try {
  //     const tokens = authResponse.data?.tokens || authResponse.tokens;
    
  //   if (!tokens || !tokens.token) {
  //     console.error('Invalid auth response structure:', authResponse);
  //     throw new Error('Invalid authentication response structure');
  //   }
  //     // Save tokens
  //     await AsyncStorage.setItem(AUTH_TOKEN_KEY, /*authResponse.*/tokens.token);
  //     if (/*authResponse.*/tokens.refreshToken) {
  //       await AsyncStorage.setItem(REFRESH_TOKEN_KEY, /*authResponse.*/tokens.refreshToken);
  //     }
      
  //     const user = authResponse.data?.user || authResponse.user;

  //     if (user){
  //       await AsyncStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
  //     }

  //     // Save user data
  //         } catch (error) {
  //     console.error('Error saving auth data:', error);
  //     throw error;
  //   }
  // }
  private async saveAuthData(authResponse: {user: User, tokens: {token: string, refreshToken?: string}}): Promise<void> {
    try {
      const { tokens, user } = authResponse;
      
      if (!tokens || !tokens.token) {
        console.error('Invalid auth response structure:', authResponse);
        throw new Error('Invalid authentication response structure');
      }
      
      // Save tokens
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, tokens.token);
      if (tokens.refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      
      // Save user data if available
      if (user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  public async refreshToken(refreshToken: string): Promise<{tokens: {token: string, refreshToken?: string}}> {
    try {
      const response = await API.post<{tokens: {token: string, refreshToken?: string}}>('/auth/refresh-token', { refreshToken });
      return response;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}
// Create and export singleton instance
const authService = new AuthService();
export default authService;