// mobile/src/services/locationService.ts
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from './api';

// =============================================================================
// TYPES
// =============================================================================

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface LocationStatus {
  status: 'success' | 'error' | 'loading' | 'permission-denied';
  coordinates?: LocationCoordinates;
  error?: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: string;
  status: "success" | "error";
  error?: string;
}

export interface ReverseGeocodeAddress {
  city?: string;
  country?: string;
  district?: string;
  name?: string;
  postalCode?: string;
  region?: string;
  street?: string;
  streetNumber?: string;
}

export interface LocationSettings {
  isLocationSharingEnabled: boolean;
  geofenceRadius: number;
}

export interface NearbyQueryParams {
  latitude: number;
  longitude: number;
  radius?: number;
  hobbyType?: string;
}

// =============================================================================
// CACHE KEYS
// =============================================================================

const LOCATION_CACHE_KEY = 'user:last-location';
const LOCATION_CACHE_EXPIRY_KEY = 'user:location-expiry';
const LOCATION_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Singleton class to manage location services with cache
 * This provides optimized and battery-friendly location services
 */
export class LocationService {
  private static instance: LocationService;
  private lastKnownLocation: LocationCoordinates | null = null;
  private locationSubscription: Location.LocationSubscription | null = null;
  private locationWatchers: Set<(location: LocationStatus) => void> = new Set();
  private permissionStatus: Location.LocationPermissionResponse | null = null;

  private constructor() {
    // Initialize by trying to load from cache
    this.loadFromCache();
  }

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Get the current location with cache support for better performance
   * @param forceRefresh Force a location refresh even if cache is valid
   * @returns Promise with location status
   */
  public async getCurrentLocation(forceRefresh = false): Promise<LocationStatus> {
    try {
      // Check if we have permission first
      if (!this.permissionStatus) {
        this.permissionStatus = await Location.requestForegroundPermissionsAsync();
      }

      if (this.permissionStatus.status !== 'granted') {
        return {
          status: 'permission-denied',
          error: 'Location permission not granted'
        };
      }

      // If we have a cached location and it's still valid, use it
      if (!forceRefresh && this.lastKnownLocation) {
        const expiry = await AsyncStorage.getItem(LOCATION_CACHE_EXPIRY_KEY);
        if (expiry && parseInt(expiry, 10) > Date.now()) {
          return {
            status: 'success',
            coordinates: this.lastKnownLocation
          };
        }
      }

      // Otherwise get a fresh location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });

      const coordinates: LocationCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy ?? undefined,
        timestamp: location.timestamp
      };

      // Update cache
      this.lastKnownLocation = coordinates;
      this.saveToCache(coordinates);

      // Notify any watchers
      this.notifyWatchers({
        status: 'success',
        coordinates
      });

      return {
        status: 'success',
        coordinates
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown location error';
      console.error("Location error:", errorMessage);
      
      // If we have a cached location, return it as fallback
      if (this.lastKnownLocation) {
        return {
          status: 'success', // Still mark as success but with stale data
          coordinates: this.lastKnownLocation,
          error: `Using cached location. ${errorMessage}`
        };
      }
      
      return {
        status: 'error',
        error: errorMessage
      };
    }
  }

  /**
   * Start watching for location updates
   * @param callback Function to call when location changes
   * @returns Function to stop watching
   */
  public startWatchingLocation(callback: (location: LocationStatus) => void): () => void {
    // Add to watchers list
    this.locationWatchers.add(callback);

    // Start location subscription if not already active
    if (!this.locationSubscription) {
      this.startLocationSubscription();
    }

    // Return function to stop watching
    return () => {
      this.locationWatchers.delete(callback);
      
      // If no more watchers, stop the subscription
      if (this.locationWatchers.size === 0) {
        this.stopLocationSubscription();
      }
    };
  }

  /**
   * Get distance between two coordinates in kilometers
   */
  public getDistanceFromLatLonInKm(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Get a human-readable representation of the distance
   */
  public getHumanReadableDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)} m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)} km`;
    } else {
      return `${Math.round(distanceKm)} km`;
    }
  }

  /**
   * Backward compatibility for the older API
   * Request location permissions and get current location
   */
  public async getLocationData(): Promise<LocationData> {
    try {
      const locationStatus = await this.getCurrentLocation();
      
      if (locationStatus.status === 'success' && locationStatus.coordinates) {
        return {
          latitude: locationStatus.coordinates.latitude,
          longitude: locationStatus.coordinates.longitude,
          accuracy: locationStatus.coordinates.accuracy,
          timestamp: locationStatus.coordinates.timestamp.toString(),
          status: "success",
        };
      } else {
        return {
          error: locationStatus.error || "Failed to get location",
          status: "error",
          latitude: 0,
          longitude: 0,
        };
      }
    } catch (error: any) {
      console.error("Error getting location:", error);
      return {
        error: error.message || "Failed to get location",
        status: "error",
        latitude: 0,
        longitude: 0,
      };
    }
  }

  /**
   * Update user's location on the server
   */
  public async updateUserLocation(locationData: LocationData): Promise<void> {
    try {
      await API.post("/users/location", {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        timestamp: locationData.timestamp || new Date().toISOString()
      });
    } catch (error) {
      console.error("Failed to update server location:", error);
      // We don't throw the error as this is a background operation
      // that shouldn't interrupt the user experience
    }
  }

  /**
   * Geocode an address to coordinates
   */
  public async geocodeAddress(address: string): Promise<LocationData> {
    try {
      const locations = await Location.geocodeAsync(address);
      if (locations && locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
          status: "success",
        };
      } else {
        return {
          error: "Location not found",
          status: "error",
          latitude: 0,
          longitude: 0,
        };
      }
    } catch (error: any) {
      console.error("Geocoding error:", error);
      return {
        error: error.message || "Failed to geocode address",
        status: "error",
        latitude: 0,
        longitude: 0,
      };
    }
  }

  /**
   * Reverse geocode coordinates to an address
   */
  public async reverseGeocodeLocation(
    latitude: number,
    longitude: number
  ): Promise<{
    address?: ReverseGeocodeAddress;
    error?: string;
    status: "success" | "error";
  }> {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (addresses && addresses.length > 0) {
        return {
          address: addresses[0] as ReverseGeocodeAddress,
          status: "success",
        };
      } else {
        return {
          error: "Address not found",
          status: "error",
        };
      }
    } catch (error: any) {
      console.error("Reverse geocoding error:", error);
      return {
        error: error.message || "Failed to reverse geocode location",
        status: "error",
      };
    }
  }

  /**
   * Update user's location sharing settings
   */
  public async updateLocationSharingSettings(settings: LocationSettings): Promise<void> {
    try {
      await API.post("/users/location/settings", settings);
    } catch (error) {
      console.error("Failed to update location settings:", error);
      throw error; // This is an explicit user action, so we propagate the error
    }
  }

  /**
   * Get nearby events based on location
   */
  public async getNearbyEvents(params: NearbyQueryParams): Promise<any> {
    try {
      const response = await API.get("/events/nearby", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch nearby events:", error);
      throw error;
    }
  }

  /**
   * Get nearby hobbies based on location
   */
  public async getNearbyHobbies(params: NearbyQueryParams): Promise<any> {
    try {
      const response = await API.get("/hobbies/nearby", { params });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch nearby hobbies:", error);
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates in kilometers
   * Alias for getDistanceFromLatLonInKm for backward compatibility
   */
  public calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    return this.getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
  }

  /**
   * Convert coordinate degrees to radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Save location to cache for faster future lookups
   */
  private async saveToCache(location: LocationCoordinates): Promise<void> {
    try {
      await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));
      await AsyncStorage.setItem(
        LOCATION_CACHE_EXPIRY_KEY, 
        (Date.now() + LOCATION_CACHE_DURATION).toString()
      );
    } catch (error) {
      console.error("Failed to cache location:", error);
    }
  }

  /**
   * Load location from cache
   */
  private async loadFromCache(): Promise<void> {
    try {
      const cachedLocation = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      const expiry = await AsyncStorage.getItem(LOCATION_CACHE_EXPIRY_KEY);
      
      if (cachedLocation && expiry && parseInt(expiry, 10) > Date.now()) {
        this.lastKnownLocation = JSON.parse(cachedLocation);
      }
    } catch (error) {
      console.error("Failed to load cached location:", error);
    }
  }

  /**
   * Start subscription to location updates
   */
  private async startLocationSubscription(): Promise<void> {
    try {
      // Check permission first
      if (!this.permissionStatus) {
        this.permissionStatus = await Location.requestForegroundPermissionsAsync();
      }
      
      if (this.permissionStatus.status !== 'granted') {
        this.notifyWatchers({
          status: 'permission-denied',
          error: 'Location permission not granted'
        });
        return;
      }
      
      // Start watching location with appropriate accuracy
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 50, // Minimum 50 meters between updates
          timeInterval: 30000, // Minimum 30 seconds between updates for battery optimization
        },
        (location) => {
          const coordinates: LocationCoordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? undefined,
            timestamp: location.timestamp
          };
          
          // Update cache
          this.lastKnownLocation = coordinates;
          this.saveToCache(coordinates);
          
          // Notify watchers
          this.notifyWatchers({
            status: 'success',
            coordinates
          });
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown location error';
      console.error("Error starting location subscription:", errorMessage);
      
      this.notifyWatchers({
        status: 'error',
        error: errorMessage
      });
    }
  }
  
  /**
   * Stop watching for location updates
   */
  private stopLocationSubscription(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }
  
  /**
   * Notify all registered watchers with location update
   */
  private notifyWatchers(status: LocationStatus): void {
    this.locationWatchers.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error("Error in location watcher callback:", error);
      }
    });
  }
}

// =============================================================================
// EXPORT CONVENIENCE FUNCTIONS FOR BACKWARDS COMPATIBILITY
// =============================================================================

/**
 * Get current location - Simplified API for backward compatibility
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
  return LocationService.getInstance().getLocationData();
};

/**
 * Update user's location on the server - Simplified API for backward compatibility
 */
export const updateUserLocation = (locationData: LocationData): Promise<void> => {
  return LocationService.getInstance().updateUserLocation(locationData);
};

/**
 * Geocode address to coordinates - Simplified API for backward compatibility
 */
export const geocodeAddress = async (address: string): Promise<LocationData> => {
  return LocationService.getInstance().geocodeAddress(address);
};

/**
 * Reverse geocode coordinates to address - Simplified API for backward compatibility
 */
export const reverseGeocodeLocation = async (
  latitude: number,
  longitude: number
): Promise<{
  address?: ReverseGeocodeAddress;
  error?: string;
  status: "success" | "error";
}> => {
  return LocationService.getInstance().reverseGeocodeLocation(latitude, longitude);
};

/**
 * Calculate distance between coordinates - Simplified API for backward compatibility
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  return LocationService.getInstance().calculateDistance(lat1, lon1, lat2, lon2);
};

/**
 * Update location sharing settings - Simplified API for backward compatibility
 */
export const updateLocationSharingSettings = (settings: LocationSettings): Promise<void> => {
  return LocationService.getInstance().updateLocationSharingSettings(settings);
};

/**
 * Get nearby events - Simplified API for backward compatibility
 */
export const getNearbyEvents = (params: NearbyQueryParams): Promise<any> => {
  return LocationService.getInstance().getNearbyEvents(params);
};

/**
 * Get nearby hobbies - Simplified API for backward compatibility
 */
export const getNearbyHobbies = (params: NearbyQueryParams): Promise<any> => {
  return LocationService.getInstance().getNearbyHobbies(params);
};