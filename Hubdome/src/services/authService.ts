// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './api';
import { User } from '../types/interfaces';

// Storage keys
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Login request interface
 */
export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
}

/**
 * Register request interface
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
}

/**
 * Social auth request interface
 */
export interface SocialAuthRequest {
  provider: 'google' | 'facebook' | 'twitter';
  token: string;
  email?: string;
  name?: string;
}

/**
 * Auth response interface
 */
export interface AuthResponse {
  user: User;
  tokens: {
    token: string;
    refreshToken?: string;
  };
}

/**
 * Auth service for handling authentication
 */
class AuthService {
  /**
   * Login with email/username and password
   */
  public async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await API.post<AuthResponse>('/auth/login', loginData);
      
      // Save auth data
      await this.saveAuthData(response);
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message 
        : 'Login failed. Please check your credentials.';
      console.error('Login error:', error);
      
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Register a new user
   */
  public async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await API.post<AuthResponse>('/auth/register', registerData);
      
      // Save auth data
      await this.saveAuthData(response);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  /**
   * Authenticate with social provider
   */
  public async socialAuth(socialAuthData: SocialAuthRequest): Promise<AuthResponse> {
    try {
      const response = await API.post<AuthResponse>('/auth/social', socialAuthData);
      
      // Save auth data
      await this.saveAuthData(response);
      
      return response;
    } catch (error) {
      console.error('Social auth error:', error);
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

      // Try to get from the API
      const response = await API.get<AuthResponse>('/auth/me');
      
      if (response && response.user) {
        // Also save any new tokens
        if (response.tokens && response.tokens.token) {
          await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.tokens.token);
          
          if (response.tokens.refreshToken) {
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
          }
        }
        
        // Save user data
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
        return response.user;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching current user:', error);
      
      // Check if the error is a 401 Unauthorized
      if (typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 401) {
        // Clear auth data and force re-login
        await this.clearAuthData();
      }
      
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
      await this.clearAuthData();
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
   * Refresh authentication token
   */
  public async refreshToken(refreshToken: string): Promise<{tokens: {token: string, refreshToken?: string}}> {
    try {
      const response = await API.post<{tokens: {token: string, refreshToken?: string}}>('/auth/refresh-token', { refreshToken });
      
      // Save new tokens
      if (response.tokens && response.tokens.token) {
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.tokens.token);
        
        if (response.tokens.refreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, response.tokens.refreshToken);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  /**
   * Save authentication data
   */
  private async saveAuthData(authResponse: AuthResponse): Promise<void> {
    try {
      const { user, tokens } = authResponse;
      
      // Validate data
      if (!tokens || !tokens.token) {
        console.error('Invalid auth response structure:', authResponse);
        throw new Error('Invalid authentication response structure');
      }
      
      // Save tokens
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, tokens.token);
      
      if (tokens.refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
      }
      
      // Save user data
      if (user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  }
  
  /**
   * Clear all authentication data
   */
  private async clearAuthData(): Promise<void> {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;