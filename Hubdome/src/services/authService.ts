// src/services/authService.ts
import API from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/interfaces';
import axios from 'axios';

// Auth tokens
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Auth response from API
 */
export interface AuthResponse {
  success: boolean;
  user: User;
  tokens: {
    token: string;
    refreshToken?: string;
  };
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
   * Log in with email/username and password
   */
  public async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await API.post<AuthResponse>('/auth/login', loginData);
      
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
  public async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await API.post<AuthResponse>('/auth/register', registerData);
      
      // Save auth data
      await this.saveAuthData(response);
      
      return response;
    } catch (error) {
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
      throw error;
    }
  }
  
  /**
   * Get current user data
   */
  public async getCurrentUser(): Promise<User | null> {
    
    try {
      // First try to get from local storage
      const userJson = await AsyncStorage.getItem(USER_KEY);
      if (userJson) {
        return JSON.parse(userJson);
      }

      // Fetch user from API (assuming API.get returns the payload as User)
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
      await API.handleLogout();
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
  private async saveAuthData(authResponse: AuthResponse): Promise<void> {
    try {
      // Save tokens
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, authResponse.tokens.token);
      if (authResponse.tokens.refreshToken) {
        await AsyncStorage.setItem(REFRESH_TOKEN_KEY, authResponse.tokens.refreshToken);
      }
      
      // Save user data
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(authResponse.user));
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  public async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await axios.post('/api/auth/refresh', { refreshToken });
      return response.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;