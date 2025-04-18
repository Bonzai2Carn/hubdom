// 1. Create a new utility file: src/utils/geocodingUtils.ts

import { LocationService } from "../services/locationService";

// Interface for location search results
export interface LocationSearchResult {
  id: string;
  type: "location" | "marker";
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

export interface SearchOptions {
  radius?: number;
  limit?: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Perform location search using Nominatim
 */
export const performLocationSearch = async (
  query: string,
  options: SearchOptions = {}
): Promise<LocationSearchResult[]> => {
  const {
    radius = 50,
    limit = 10,
    userLocation
  } = options;
  
  if (query.length < 3) {
    return [];
  }
  
  try {
    // If we have user location, search within a bounding box
    if (userLocation) {
      const boundingBox = calculateBoundingBox(
        userLocation.latitude,
        userLocation.longitude,
        radius
      );
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `viewbox=${boundingBox.join(",")}&` +
        `bounded=1&` +
        `limit=${limit}`,
        {
          headers: {
            'User-Agent': 'HobbyHub App/1.0'
          }
        }
      );
      
      const results = await response.json();
      
      return results.map((result: any) => ({
        id: `location-${result.place_id}`,
        type: "location",
        title: result.display_name,
        formattedAddress: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        description: `${result.type.charAt(0).toUpperCase() + result.type.slice(1)}`,
      }));
    } else {
      // General search without bounding box
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `limit=${limit}`,
        {
          headers: {
            'User-Agent': 'HobbyHub App/1.0'
          }
        }
      );
      
      const results = await response.json();
      
      return results.map((result: any) => ({
        id: `location-${result.place_id}`,
        type: "location",
        title: result.display_name,
        formattedAddress: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        description: `${result.type.charAt(0).toUpperCase() + result.type.slice(1)}`,
      }));
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return [];
  }
};

/**
 * Calculate bounding box for a given center and radius
 */
export const calculateBoundingBox = (
  lat: number,
  lon: number,
  radius: number
): [number, number, number, number] => {
  const R = 6371; // Earth's radius in km
  const maxLat = lat + (radius / R) * (180 / Math.PI);
  const minLat = lat - (radius / R) * (180 / Math.PI);
  const maxLon = lon + (radius / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  const minLon = lon - (radius / R) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  return [minLon, minLat, maxLon, maxLat];
};

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
};

// reverse geocoding function
// Add to geocodingUtils.ts
/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<LocationSearchResult | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${latitude}&` +
        `lon=${longitude}`,
        {
          headers: {
            'User-Agent': 'HobbyHub App/1.0'
          }
        }
      );
      
      const result = await response.json();
      
      if (result.error) {
        return null;
      }
      
      return {
        id: `location-${result.place_id}`,
        type: "location",
        title: result.display_name,
        formattedAddress: result.display_name,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        description: `${result.type.charAt(0).toUpperCase() + result.type.slice(1)}`,
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  };