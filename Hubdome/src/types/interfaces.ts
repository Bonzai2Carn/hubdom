// src/types/interfaces.ts

/**
 * Base API response format for all endpoints
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
    count?: number;
  }
  
  /**
   * Error response format
   */
  export interface ApiError {
    success: false;
    error: string;
    details?: Record<string, string[]>;
    status?: number;
  }
  
  export interface ErrorResponse {
    error: string;
    code?: string;
  }
  /**
   * Pagination parameters
   */
  export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
  }
  
  /**
   * Location coordinates
   */
  export interface Coordinates {
    latitude: number;
    longitude: number;
  }
  
  /**
   * Geolocation interface
   */
  export interface GeoLocation {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude] format for MongoDB
    formattedAddress?: string;
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  }
  
  /**
   * User model interface
   */
  export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
    bio?: string;
    avatar?: string;
    location?: GeoLocation;
    hobbies?: string[]; // Array of hobby IDs
    createdAt: string;
    updatedAt?: string;
    // Social auth properties
    googleId?: string;
    facebookId?: string;
    twitterId?: string;
  }
  
  /**
   * Auth related interfaces
   */
  export interface AuthTokens {
    token: string;
    refreshToken?: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    user: User;
    tokens: AuthTokens;
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    name: string;
  }
  
  export interface LoginRequest {
    username?: string;
    email?: string;
    password: string;
  }
  
  export interface SocialAuthRequest {
    provider: 'google' | 'facebook' | 'twitter';
    token: string;
    email?: string;
    name?: string;
  }
  
  /**
   * Hobby model interface
   */
  // mobile/src/types/interfaces.ts (partial update for Hobby)

/**
 * Hobby model interface
 */
export interface Hobby {
  id: string;
  name: string;
  description: string;
  image?: string;
  category?: string;
  popularity?: number;
  tags?: string[];
  creator?: string; // Matches the schema field type
  createdAt: string;
  updatedAt?: string;
}
  
  export interface HobbyRequest {
    // Define the required fields for creating/updating a hobby.
    name: string;
    description?: string;
    // Add more fields as needed.
  }
  /**
   * Event model interface
   */
  export interface Event {
    id: string;
    title: string;
    description: string;
    hobby: Hobby | string; // Can be populated with full hobby or just ID
    organizer: User | string; // Can be populated with full user or just ID
    location: GeoLocation;
    startDate: string;
    endDate: string;
    capacity: number;
    participants: (User | string)[]; // Can be populated with full users or just IDs
    image?: string;
    isPrivate: boolean;
    tags?: string[];
    createdAt: string;
    updatedAt?: string;
  }
  
  /**
   * Team model interface
   */
  export interface Team {
    id: string;
    name: string;
    description: string;
    hobby: Hobby | string; // Can be populated with full hobby or just ID
    creator: User | string; // Can be populated with full user or just ID
    members: {
      user: User | string;
      role: 'admin' | 'moderator' | 'member';
      joinedAt: string;
    }[];
    location?: GeoLocation;
    image?: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt?: string;
  }
  
  /**
   * Message model interface
   */
  export interface Message {
    id: string;
    sender: User | string;
    receiver?: User | string;
    team?: Team | string;
    content: string;
    attachments?: {
      type: 'image' | 'video' | 'file';
      url: string;
    }[];
    readBy: {
      user: User | string;
      readAt: string;
    }[];
    createdAt: string;
    updatedAt?: string;
  }
  
  /**
   * Conversation model interface
   */
  export interface Conversation {
    id: string;
    participants: (User | string)[];
    isGroupChat: boolean;
    groupName?: string;
    lastMessage?: Message | string;
    createdBy: User | string;
    createdAt: string;
    updatedAt: string;
  }