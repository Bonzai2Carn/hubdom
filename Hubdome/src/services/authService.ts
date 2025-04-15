// src/services/authService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

const USER_KEY = 'user_data';
const TOKEN_KEY = 'auth_token';

export interface User {
  id?: string;
  email?: string;
  username?: string;
  name?: string;
  avatarType?: string;
  role: string;
  createdAt: string;
}

export interface LoginRequest {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface SocialAuthRequest {
  provider: 'google' | 'facebook' | 'twitter';
  token: string;
  email?: string;
  name?: string;
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  username?: string;
  avatarType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  user?: User;
}

export class AuthService {
  public async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
    try {
      const response = await API.post<ApiResponse<User>>('/auth/login', credentials);
      if (response.success && response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  public async register(userData: RegisterRequest): Promise<ApiResponse<User>> {
    try {
      const response = await API.post<ApiResponse<User>>('/auth/register', userData);
      if (response.success && response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  }

  public async socialAuth(socialData: SocialAuthRequest): Promise<ApiResponse<User>> {
    try {
      const response = await API.post<ApiResponse<User>>('/api/v1/auth/social', socialData);
      if (response.success && response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Social auth error:', error);
      throw new Error(error instanceof Error ? error.message : 'Social authentication failed');
    }
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get current user');
    }
  }

  public async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
      await API.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error(error instanceof Error ? error.message : 'Logout failed');
    }
  }

  public async updateUserProfile(profileData: UserProfileUpdate): Promise<ApiResponse<User>> {
    try {
      const response = await API.put<ApiResponse<User>>('/api/v1/users/profile', profileData);
      if (response.success && response.user) {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update profile');
    }
  }

  public async updateUserAvatar(avatarType: string): Promise<ApiResponse<User>> {
    try {
      const validAvatarTypes = [
        'Competitor', 'Visionary', 'Maestro', 'Strategist', 'Connector', 
        'Gourmet', 'Chef', 'Explorer', 'Scholar', 'Maker', 'Curator', 
        'Sage', 'Tinkerer', 'Animal Advocate', 'Wanderer', 'Digital Nomad'
      ];

      if (!validAvatarTypes.includes(avatarType)) {
        throw new Error('Invalid avatar type');
      }

      const response = await API.put<ApiResponse<User>>('/api/v1/users/avatar', { avatarType });
      if (response.success && response.user) {
        const userJson = await AsyncStorage.getItem(USER_KEY);
        if (userJson) {
          const user = JSON.parse(userJson);
          user.avatarType = response.user.avatarType;
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        }
      }
      return response;
    } catch (error) {
      console.error('Error updating user avatar:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update avatar');
    }
  }
}

export const authService = new AuthService();
export default authService;