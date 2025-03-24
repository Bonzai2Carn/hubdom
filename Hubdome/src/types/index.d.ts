// src/types/index.ts

// Location region type for geofencing
export interface LocationRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

// User location data type
export interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
}

// Location sharing settings type
export interface LocationSharingSettings {
  isEnabled: boolean;
  radius: number;
  sharingMode?: "all" | "friends" | "none";
}

// Hobby event location type
export interface EventLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
}

// Map style options for low-poly rendering
export interface MapStyleOptions {
  lowPolyEnabled: boolean;
  terrainEnabled: boolean;
  colorScheme: "default" | "dark" | "light" | "satellite";
  labelVisibility: boolean;
}

// Triangle data for Delaunay triangulation
export interface TriangleData {
  points: number[][];
  color: string;
}
