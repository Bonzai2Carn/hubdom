// src/types/map.ts

/**
 * Map marker type representing events or content on the map
 */
export interface MapMarker {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    type: 'event' | 'user' | 'content';
    subType?: 'video' | 'audio' | 'thread' | 'photo';
    createdAt: string;
    createdBy: string;
    imageUrl?: string;
  }
  
  /**
   * Map style options
   */
  export type MapStyleType = 'standard' | 'satellite' | 'terrain';
  
  /**
   * Map style URLs for different style options
   */
  export const MAP_STYLE_URLS: Record<MapStyleType, string> = {
    standard: 'https://tiles.openfreemap.org/styles/positron',
    satellite: require('../../public/styles/polygon.json'),
    terrain: 'https://tiles.openfreemap.org/styles/liberty'
    
  };
  
  /**
   * Location data structure
   */
  export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
  }