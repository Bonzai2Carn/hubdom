// mobile/src/services/locationService.ts
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { throttle } from 'lodash';

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
  state?: string;
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
// CACHE KEYS AND CONFIGURATION
// =============================================================================

const LOCATION_CACHE_KEY = 'user:last-location';
const LOCATION_CACHE_EXPIRY_KEY = 'user:location-expiry';
const LAST_LOCATION_REQUEST_KEY = 'user:last-location-request';
const LOCATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
const LOCATION_IDLE_UPDATE_THRESHOLD = 15 * 60 * 1000; // 15 minutes idle threshold
const MIN_LOCATION_UPDATE_INTERVAL = 10 * 60 * 1000; // 10 minutes between background updates

/**
 * Battery-friendly, optimized location service with intelligent caching
 * This singleton class manages location requests efficiently to minimize battery drain
 */
export class LocationService {
  private static instance: LocationService;
  private lastKnownLocation: LocationCoordinates | null = null;
  private locationSubscription: Location.LocationSubscription | null = null;
  private locationWatchers: Set<(location: LocationStatus) => void> = new Set();
  private permissionStatus: Location.LocationPermissionResponse | null = null;
  private isSubscriptionActive: boolean = false;
  private idleTimer: NodeJS.Timeout | null = null;

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
   * Get the current location with intelligent caching
   * @param forceRefresh Force a location refresh even if cache is valid
   * @returns Promise with location status
   */
  public async getCurrentLocation(forceRefresh = false): Promise<LocationStatus> {
    try {
      // Check last request timestamp to prevent too frequent updates
      if (!forceRefresh) {
        const lastRequestTimestamp = await AsyncStorage.getItem(LAST_LOCATION_REQUEST_KEY);
        const now = Date.now();
        
        if (lastRequestTimestamp && 
            (now - parseInt(lastRequestTimestamp, 10)) < MIN_LOCATION_UPDATE_INTERVAL) {
          // If we requested location recently and have cached data, use it
          if (this.lastKnownLocation) {
            return {
              status: 'success',
              coordinates: this.lastKnownLocation
            };
          }
        }
      }
      
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
      await AsyncStorage.setItem(LAST_LOCATION_REQUEST_KEY, Date.now().toString());
      
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

      // Start idle timer for background updates
      this.resetIdleTimer();

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
   * Start watching for location updates with battery-friendly settings
   * @param callback Function to call when location changes
   * @returns Function to stop watching
   */
  public startWatchingLocation(callback: (location: LocationStatus) => void): () => void {
    // Add to watchers list
    this.locationWatchers.add(callback);

    // Start location subscription if not already active
    if (!this.isSubscriptionActive) {
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
   * Update user's location on the server
   * Throttled to prevent too many requests
   */
  public updateUserLocation = throttle(async (locationData: LocationData): Promise<void> => {
    try {
      // In a real app, this would call an API endpoint
      console.log("Updating server with location:", locationData);
      
      // For now, just update the cache
      if (locationData.status === "success") {
        const coordinates: LocationCoordinates = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          accuracy: locationData.accuracy,
          timestamp: Date.now()
        };
        
        this.lastKnownLocation = coordinates;
        this.saveToCache(coordinates);
      }
    } catch (error) {
      console.error("Failed to update server location:", error);
    }
  }, 60000); // Throttle to once per minute maximum

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
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
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
   * Update user's location sharing settings
   */
  public async updateLocationSharingSettings(settings: LocationSettings): Promise<void> {
    try {
      // In a real app, this would call an API endpoint
      console.log("Updating location sharing settings:", settings);
      
      // Store settings in AsyncStorage for persistence
      await AsyncStorage.setItem('location:sharing-enabled', settings.isLocationSharingEnabled.toString());
      await AsyncStorage.setItem('location:geofence-radius', settings.geofenceRadius.toString());
    } catch (error) {
      console.error("Failed to update location settings:", error);
      throw error;
    }
  }

  /**
   * Get nearby events based on location
   */
  public async getNearbyEvents(params: NearbyQueryParams): Promise<any> {
    try {
      // In a real app, this would call an API endpoint
      console.log("Fetching nearby events:", params);
      
      // Simulate API call with timeout
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: [
              {
                id: '1',
                title: 'Photography Workshop',
                distance: this.getHumanReadableDistance(
                  this.getDistanceFromLatLonInKm(
                    params.latitude, 
                    params.longitude, 
                    params.latitude + 0.01, 
                    params.longitude + 0.01
                  )
                )
              },
              {
                id: '2',
                title: 'Local Hiking Group',
                distance: this.getHumanReadableDistance(
                  this.getDistanceFromLatLonInKm(
                    params.latitude, 
                    params.longitude, 
                    params.latitude - 0.02, 
                    params.longitude - 0.005
                  )
                )
              }
            ]
          });
        }, 500);
      });
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
      // In a real app, this would call an API endpoint
      console.log("Fetching nearby hobbies:", params);
      
      // Simulate API call with timeout
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            success: true,
            data: [
              {
                id: '1',
                name: 'Photography',
                popularity: 120,
                distance: this.getHumanReadableDistance(
                  this.getDistanceFromLatLonInKm(
                    params.latitude, 
                    params.longitude, 
                    params.latitude + 0.008, 
                    params.longitude + 0.005
                  )
                )
              },
              {
                id: '2',
                name: 'Hiking',
                popularity: 85,
                distance: this.getHumanReadableDistance(
                  this.getDistanceFromLatLonInKm(
                    params.latitude, 
                    params.longitude, 
                    params.latitude - 0.015, 
                    params.longitude + 0.008
                  )
                )
              }
            ]
          });
        }, 500);
      });
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
   * Reset idle timer for background location updates
   * This helps optimize battery usage by only updating when necessary
   */
  private resetIdleTimer(): void {
    // Clear existing timer if any
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    
    // Set new timer
    this.idleTimer = setTimeout(() => {
      // After idle period, try to get a new location update
      // but only if we have active watchers
      if (this.locationWatchers.size > 0) {
        this.getCurrentLocation(true)
          .catch(err => console.error("Background location update failed:", err));
      }
    }, LOCATION_IDLE_UPDATE_THRESHOLD);
  }

  /**
   * Start subscription to location updates
   * Uses battery-friendly settings to minimize power consumption
   */
  private async startLocationSubscription(): Promise<void> {
    try {
      if (this.isSubscriptionActive) return;
      
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
      
      // Start watching location with battery-friendly settings
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100, // Minimum 100 meters between updates
          timeInterval: 5 * 60 * 1000, // Minimum 5 minutes between updates for battery optimization
        },
        (location) => {
          const coordinates: LocationCoordinates = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy ?? undefined,
            timestamp: location.timestamp
          };
          
          // Only update cache if significant movement detected
          if (!this.lastKnownLocation || 
              this.getDistanceFromLatLonInKm(
                coordinates.latitude,
                coordinates.longitude,
                this.lastKnownLocation.latitude,
                this.lastKnownLocation.longitude
              ) > 0.1) { // Only update if moved more than 100m
            
            // Update cache
            this.lastKnownLocation = coordinates;
            this.saveToCache(coordinates);
            
            // Reset idle timer
            this.resetIdleTimer();
            
            // Notify watchers
            this.notifyWatchers({
              status: 'success',
              coordinates
            });
          }
        }
      );
      
      this.isSubscriptionActive = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown location error';
      console.error("Error starting location subscription:", errorMessage);
      
      this.isSubscriptionActive = false;
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
    
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
    
    this.isSubscriptionActive = false;
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
  const locationService = LocationService.getInstance();
  const location = await locationService.getCurrentLocation();
  
  if (location.status === 'success' && location.coordinates) {
    return {
      latitude: location.coordinates.latitude,
      longitude: location.coordinates.longitude,
      accuracy: location.coordinates.accuracy,
      timestamp: new Date(location.coordinates.timestamp).toISOString(),
      status: "success",
    };
  } else {
    return {
      error: location.error || "Failed to get location",
      status: "error",
      latitude: 0,
      longitude: 0,
    };
  }
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