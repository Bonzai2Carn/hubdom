// src/services/api.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

/**
 * API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

/**
 * Error details for better error handling
 */
export interface ApiError {
  status: number;
  message: string;
  code?: string;
  isNetworkError: boolean;
  isServerError: boolean;
  originalError?: AxiosError;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

/**
 * Cache item structure
 */
interface CacheItem<T> {
  data: T;
  expiry: number;
}

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_PREFIX = 'api_cache:';

// Auth token keys
const AUTH_TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Enhanced API service with:
 * - Error handling
 * - Retries
 * - Caching
 * - Token management
 * - Offline support
 */
class ApiService {
  private client: AxiosInstance;
  private maxRetries: number = 3;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];
  
  constructor() {
    // Create axios instance with base configuration
    this.client = axios.create({
      baseURL: this.getBaseURL(),
      timeout: 10000, // 10s timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Set up request interceptor to add auth token
    this.client.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );
    
    // Set up response interceptor for consistent format
    this.client.interceptors.response.use(
      this.handleResponse,
      this.handleResponseError
    );
  }
  
  /**
   * Get base URL based on platform
   */
  private getBaseURL(): string {
    if (Platform.OS === 'android') {
      // Android emulator runs in a separate VM, so localhost refers to the VM not your machine
      return 'http://10.0.2.2:3000/api/v1';
    } else if (Platform.OS === 'ios') {
      // iOS simulator shares network with your machine
      return 'http://localhost:3000/api/v1';
    } else {
      // For web or other platforms
      return 'http://localhost:3000/api/v1';
    }
  }
  
  /**
   * Add new token refresh subscriber
   */
  private onTokenRefreshed(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }
  
  /**
   * Notify all subscribers that token has been refreshed
   */
  private notifySubscribers(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }
  
  /**
   * Attempt to refresh the auth token
   */
  private async refreshAuthToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Create a new axios instance to avoid interceptors
      const response = await axios.post(
        `${this.getBaseURL()}/auth/refresh-token`,
        { refreshToken }
      );
      
      // Check if response is successful and has token
      if (response.data.success && response.data.tokens && response.data.tokens.token) {
        const { token, refreshToken: newRefreshToken } = response.data.tokens;
        
        // Store new tokens
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        if (newRefreshToken) {
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
        }
        
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear auth tokens since they're invalid
      await this.handleLogout();
      return null;
    }
  }
  
  /**
   * Handle request interceptor - add token if available
   */
  private handleRequest = async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    try {
      // Get token from storage
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      
      // If token exists, add it to headers
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      return config;
    } catch (error) {
      console.error('Error accessing token from storage:', error);
      return config;
    }
  };
  
  /**
   * Handle request error
   */
  private handleRequestError = (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  };
  
  /**
   * Handle successful response
   */
  private handleResponse = (response: AxiosResponse): AxiosResponse => {
    // Standardize response format
    if (response.data && !response.data.hasOwnProperty('success')) {
      // If response doesn't have success property, standardize it
      response.data = {
        success: true,
        data: response.data
      };
    }
    
    return response;
  };
  
  /**
   * Handle response error with retry logic
   */
  private handleResponseError = async (error: AxiosError): Promise<any> => {
    const originalRequest: any = error.config;
    
    // Check if we need to retry
    if (originalRequest && originalRequest.retryCount === undefined) {
      originalRequest.retryCount = 0;
    }
    
    // Check if we should retry (exclude auth errors from retries)
    if (
      originalRequest && 
      originalRequest.retryCount < this.maxRetries && 
      error.response?.status !== 401
    ) {
      // Exponential backoff
      const delay = Math.pow(2, originalRequest.retryCount) * 1000;
      originalRequest.retryCount++;
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
      
      // Try again
      return this.client(originalRequest);
    }
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === 401 && 
        originalRequest && 
        !originalRequest._retry &&
        // Don't retry auth endpoints
        !originalRequest.url?.includes('/auth/login') &&
        !originalRequest.url?.includes('/auth/register')
    ) {
      if (this.isRefreshing) {
        // Wait for token refresh and retry with new token
        return new Promise((resolve) => {
          this.onTokenRefreshed((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(this.client(originalRequest));
          });
        });
      }
      
      originalRequest._retry = true;
      this.isRefreshing = true;
      
      try {
        const newToken = await this.refreshAuthToken();
        
        if (newToken) {
          // Retry the original request with new token
          this.notifySubscribers(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return this.client(originalRequest);
        } else {
          // If refresh failed, need to re-authenticate
          await this.handleLogout();
          throw new Error('Session expired. Please login again.');
        }
      } catch (refreshError) {
        // Handle refresh token error
        await this.handleLogout();
        throw new Error('Authentication failed. Please login again.');
      } finally {
        this.isRefreshing = false;
      }
    }
    
    // Standardize error format for easier handling
    const errorData = error.response?.data as ErrorResponse || {};
    const apiError: ApiError = {
      status: error.response?.status || 0,
      message: errorData.error || error.message || 'Unknown error occurred',
      code: errorData.code,
      isNetworkError: !error.response,
      isServerError: error.response?.status ? error.response.status >= 500 : false,
      originalError: error,
    };
    
    return Promise.reject(apiError);
  };
  
  /**
   * Handle logout by clearing tokens
   */
  public async handleLogout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
  
  /**
   * Check if device is online
   */
  private async isOnline(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected !== false;
  }
  
  /**
   * Generate cache key for a request
   */
  private getCacheKey(url: string, params?: any): string {
    const queryString = params ? JSON.stringify(params) : '';
    return `${CACHE_PREFIX}${url}?${queryString}`;
  }
  
  /**
   * Get data from cache
   */
  private async getFromCache<T>(key: string): Promise<CacheItem<T> | null> {
    try {
      const cachedData = await AsyncStorage.getItem(key);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.error('Error reading from cache:', error);
    }
    return null;
  }
  
  /**
   * Save data to cache
   */
  private async saveToCache<T>(key: string, data: T, duration: number = CACHE_DURATION): Promise<void> {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        expiry: Date.now() + duration,
      };
      await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }
  
  /**
   * Check if cached data is still valid
   */
  private isCacheValid<T>(cacheItem: CacheItem<T>): boolean {
    return cacheItem.expiry > Date.now();
  }
  
  /**
   * Make GET request with caching
   */
  public async get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
    useCache: boolean = true,
    cacheDuration: number = CACHE_DURATION
  ): Promise<T> {
    // Generate cache key
    const cacheKey = this.getCacheKey(url, params);
    
    // Check if we should try to use cache
    if (useCache) {
      // Try to get from cache first
      const cachedData = await this.getFromCache<T>(cacheKey);
      
      // If we have valid cached data, return it
      if (cachedData && this.isCacheValid(cachedData)) {
        return cachedData.data;
      }
    }
    
    // Check connectivity
    const isOnline = await this.isOnline();
    if (!isOnline) {
      // If offline and we have any cached data, return it even if expired
      if (useCache) {
        const cachedData = await this.getFromCache<T>(cacheKey);
        if (cachedData) {
          return cachedData.data;
        }
      }
      
      // If no cached data available, throw error
      throw {
        status: 0,
        message: 'No internet connection available',
        isNetworkError: true,
        isServerError: false,
      } as ApiError;
    }
    
    // Make the request
    try {
      const response = await this.client.get<ApiResponse<T>>(url, {
        ...config,
        params,
      });
      
      // Cache the response if caching is enabled
      if (useCache) {
        const dataToCache = response.data.data || response.data;
        await this.saveToCache(cacheKey, dataToCache, cacheDuration);
      }
      
      return (response.data.data !== undefined ? response.data.data : response.data) as T;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Make POST request
   */
  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return (response.data.data !== undefined ? response.data.data : response.data) as T;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Make PUT request
   */
  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return (response.data.data !== undefined ? response.data.data : response.data) as T;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Make DELETE request
   */
  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return (response.data.data !== undefined ? response.data.data : response.data) as T;
    } catch (error) {
      throw error;
    }
  }
  
  /**
   * Clear all cache
   */
  public async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}

// Create and export singleton instance
const API = new ApiService();
export default API;