// src/services/eventService.ts
import API, { ApiResponse, ApiError } from './api';
import { MapMarker } from '../types/map';

/**
 * Event data interface
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
    formattedAddress: string;
  };
  hobby: {
    id: string;
    name: string;
  };
  organizer: {
    id: string;
    name: string;
  };
  participants: Array<{
    id: string;
    name: string;
  }>;
  capacity: number;
  isPrivate: boolean;
  image?: string;
  createdAt: string;
}

/**
 * New event data interface
 */
export interface CreateEventData {
  title: string;
  description: string;
  hobbyId: string;
  location?: {
    coordinates: [number, number];
    formattedAddress: string;
  };
  startDate: string;
  endDate: string;
  capacity?: number;
  isSolo?: boolean; //added this
  isPrivate?: boolean;
  isPublic?: boolean;
}

/**
 * Location-based query parameters
 */
export interface NearbyQueryParams {
  latitude: number;
  longitude: number;
  radius?: number;
  hobbyType?: string;
}

/**
 * Service for event-related API calls
 */
class EventService {
  /**
   * Get all events
   */
  public async getAllEvents(): Promise<Event[]> {
    try {
      const response = await API.get<Event[]>('/events');
      return response;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to fetch events');
      return [];
    }
  }

  /**
   * Get a single event by ID
   */
  public async getEvent(id: string): Promise<Event> {
    try {
      const event = await API.get<Event>(`/events/${id}`);
      return event;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to fetch event details');
      throw error;
    }
  }

  /**
   * Get events nearby a location
   */
  public async getNearbyEvents(params: NearbyQueryParams): Promise<Event[]> {
    try {
      const nearbyEvents = await API.get<Event[]>('/events/nearby', params);
      return nearbyEvents;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to fetch nearby events');
      return [];
    }
  }

  /**
   * Get events organized by the current user
   */
  public async getUserEvents(): Promise<Event[]> {
    try {
      const userEvents = await API.get<Event[]>('/events/user/me');
      return userEvents;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to fetch your events');
      return [];
    }
  }

  /**
   * Get events for a specific hobby
   */
  public async getEventsByHobby(hobbyId: string): Promise<Event[]> {
    try {
      const eventsbyHobby = await API.get<Event[]>(`/events/hobby/${hobbyId}`);
      return eventsbyHobby;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to fetch hobby events');
      return [];
    }
  }

  /**
   * Create a new event
   */
  public async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const createdEvent = await API.post<Event>('/events', eventData);
      return createdEvent;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to create event');
      throw error;
    }
  }

  /**
   * Update an existing event
   */
  public async updateEvent(id: string, eventData: Partial<CreateEventData>): Promise<Event> {
    try {
      const eventUpdate = await API.put<Event>(`/events/${id}`, eventData);
      return eventUpdate;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to update event');
      throw error;
    }
  }

  /**
   * Delete an event
   */
  public async deleteEvent(id: string): Promise<ApiResponse<{ id: string }>> {
    try {
      const response = await API.delete<{ id: string }>(`/events/${id}`);
      return { success: true, data: { id } };
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to delete event');
      throw error;
    }
  }

  /**
   * Join an event
   */
  public async joinEvent(id: string): Promise<Event> {
    try {
      const response = await API.post<Event>(`/events/${id}/join`);
      return response;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to join event');
      throw error;
    }
  }

  /**
   * Leave an event
   */
  public async leaveEvent(id: string): Promise<Event> {
    try {
      const leave = await API.post<Event>(`/events/${id}/leave`);
      return leave;
    } catch (error) {
      this.handleError(error as ApiError, 'Failed to leave event');
      throw error;
    }
  }

  /**
   * Convert API Event to MapMarker format
   */
  public eventToMapMarker(event: Event): MapMarker {
    return {
      id: event.id,
      latitude: event.location.coordinates[1], // API uses [longitude, latitude]
      longitude: event.location.coordinates[0],
      title: event.title,
      description: event.description,
      type: 'event',
      // Determine subType based on hobby or tags if available
      subType: 'thread', // Default for now
      createdAt: event.createdAt,
      createdBy: event.organizer.name,
      imageUrl: event.image,
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: ApiError, fallbackMessage: string): void {
    // Log the error
    console.error(`${fallbackMessage}:`, error);

    // You could extend this to send errors to an error tracking service
    // or handle specific error types differently

    // Rethrow the error with a more user-friendly message
    if (error.isNetworkError) {
      error.message = 'Network error. Please check your internet connection.';
    } else if (error.isServerError) {
      error.message = 'Server error. Please try again later.';
    } else if (!error.message) {
      error.message = fallbackMessage;
    }
  }
}

export default new EventService();

