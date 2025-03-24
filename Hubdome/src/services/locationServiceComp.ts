// mobile/src/services/locationService.ts
// Compatibility file to avoid breaking existing imports
/*
This file serves as a compatibility layer to ensure that existing imports continue functioning even if the underlying location service implementation changes. It begins by importing various methods and type declarations—such as the LocationService class, LocationData, ReverseGeocodeAddress, and several utility functions (getCurrentLocation, updateUserLocation, geocodeAddress, reverseGeocodeLocation, and calculateDistance)—from the main LocationService file. It then immediately re-exports these items, so code relying on the old file structure will not break.

In addition to re-exporting, the file defines two interfaces. The first interface, LocationSettings, specifies configuration options for location services, with properties to indicate whether location sharing is enabled and what geofence radius is applied. The second interface, NearbyQueryParams, outlines the parameters needed for querying nearby data; it includes required latitude and longitude values along with optional radius and hobby type filters.

The file also includes three utility functions that represent higher-level API actions. The updateLocationSharingSettings function accepts a LocationSettings object and logs the update action, serving as a placeholder for a real API call that would update a user’s location sharing settings on a backend service. Similarly, the getNearbyEvents and getNearbyHobbies functions take a NearbyQueryParams object and log the respective query actions. These functions are designed to simulate how the API calls might be structured, with commented-out lines indicating where an actual API request would be implemented using a designated API service.
*/ 
import {
    LocationService,
    LocationData,
    ReverseGeocodeAddress,
    getCurrentLocation,
    updateUserLocation,
    geocodeAddress,
    reverseGeocodeLocation,
    calculateDistance
  } from './locationService';
  
  // Re-export all methods and types for backward compatibility
  export {
    LocationService,
    LocationData,
    ReverseGeocodeAddress,
    getCurrentLocation,
    updateUserLocation,
    geocodeAddress,
    reverseGeocodeLocation,
    calculateDistance
  };
  
  // Interface for location settings
  export interface LocationSettings {
    isLocationSharingEnabled: boolean;
    geofenceRadius: number;
  }
  
  // Interface for nearby query parameters
  export interface NearbyQueryParams {
    latitude: number;
    longitude: number;
    radius?: number;
    hobbyType?: string;
  }
  
  /**
   * Update user's location sharing settings
   * @param settings - The settings object
   * @returns {Promise<any>} API response promise
   */
  export const updateLocationSharingSettings = (settings: LocationSettings) => {
    // This would call your API service to update location settings
    console.log("Updating location settings", settings);
    // Actual implementation would use your API class, e.g.:
    // return API.post("/users/location/settings", settings);
  };
  
  /**
   * Get nearby events based on location
   * @param params - Query parameters
   * @returns Promise resolving to the API response
   */
  export const getNearbyEvents = (params: NearbyQueryParams) => {
    // This would call your API service to get nearby events
    console.log("Getting nearby events", params);
    // Actual implementation would use your API class, e.g.:
    // return API.get("/events/nearby", { params });
  };
  
  /**
   * Get nearby hobbies based on location
   * @param params - Query parameters
   * @returns Promise resolving to the API response
   */
  export const getNearbyHobbies = (params: NearbyQueryParams) => {
    // This would call your API service to get nearby hobbies
    console.log("Getting nearby hobbies", params);
    // Actual implementation would use your API class, e.g.:
    // return API.get("/hobbies/nearby", { params });
  };