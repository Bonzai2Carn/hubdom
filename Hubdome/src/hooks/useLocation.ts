// src/hooks/useLocation.ts
import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { updateUserLocation } from '../services/locationService';

export interface LocationHookResult {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  permissionStatus: string | null;
  isLoading: boolean;
  requestLocation: () => Promise<void>;
}

/**
 * Custom hook for getting user location with error handling
 * Features:
 * - Permission handling
 * - Loading states
 * - Error management
 * - Background location updates (with battery optimization)
 * - Server synchronization
 */
export const useLocation = (): LocationHookResult => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const requestLocation = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status !== "granted") {
        setErrorMsg("Location permission was denied");
        setIsLoading(false);
        return;
      }
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      setLocation(currentLocation);
      
      // Update server with location data
      updateUserLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: new Date().toISOString(),
        status: "success",
      }).catch(err => {
        console.error("Failed to update server with location:", err);
        // Don't show this error to user as it's not critical
      });
      
    } catch (error) {
      console.error("Error getting location:", error);
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      setErrorMsg(`Failed to get your location: ${message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Request location when hook is first used
  useEffect(() => {
    requestLocation();
    
    // Set up location watcher for real-time updates with battery optimization
    let locationSubscription: Location.LocationSubscription | null = null;
    
    const startLocationUpdates = async () => {
      if (permissionStatus !== "granted") return;
      
      try {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 100, // Update every 100 meters
            timeInterval: 60000, // Or every 60 seconds
          },
          (newLocation) => {
            setLocation(newLocation);
            
            // Update location on server in the background
            updateUserLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              timestamp: new Date().toISOString(),
              status: "success",
            }).catch(err => {
              console.error("Failed to update server location:", err);
              // We don't need to expose this error to the user
            });
          }
        );
      } catch (error) {
        console.error("Error watching location:", error);
        // Don't set error message here as we already have a location
      }
    };
    
    // Only start watching if we have permission
    if (permissionStatus === "granted") {
      startLocationUpdates();
    }
    
    // Clean up subscription when component unmounts
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [permissionStatus]);

  return {
    location,
    errorMsg,
    permissionStatus,
    isLoading,
    requestLocation
  };
};