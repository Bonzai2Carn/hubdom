// src/types/map.ts
import { MapRef } from '@vis.gl/react-maplibre';


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
    terrain: require('../../public/styles/polygon.json'),
    standard: require('../../public/styles/trygon.json'),
    satellite: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', //need to check the licensing on this
    
  };
  
  export interface MapViewState {
    pitch: number;
    bearing: number;
  }
  
  export interface MapViewComponentProps {
    initialViewState: {
      longitude: number;
      latitude: number;
      zoom: number;
      pitch?: number;
      bearing?: number;
    };
    onLongPress?: (coordinates: { latitude: number; longitude: number }) => void;
    markers: MapMarker[];
    userLocation?: {
      longitude: number;
      latitude: number;
    };
    mapStyle: string;
    onMarkerPress: (marker: MapMarker) => void;
    selectedMarker: MapMarker | null;
    onStyleChange?: () => void;
  }
  
  export interface MapViewComponentHandle {
    flyTo: (options: { latitude: number; longitude: number; zoom?: number }) => void;
    zoomIn: () => void;
    zoomOut: () => void;
    recenter: () => void;
    rotateTo: (angle: number) => void;
  }
  
  export interface MapControlsProps {
    mapRef: React.RefObject<MapRef>;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    viewState: MapViewState;
    setViewState: (state: MapViewState) => void;
    userLocation?: { longitude: number; latitude: number };
    onStyleChange?: () => void;
  }
  /**
   * Location data structure
   */
  export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
  }

  export interface MapScreenState {
    isCreateModalOpen: boolean;
    isProfileOpen: boolean;
    isNotificationOpen: boolean;
    searchQuery: string;
    isBannerVisible: boolean;
    isScreenReaderEnabled: boolean;
    mapStyle: MapStyleType;
    isSearching: boolean;
    longPressCoordinates: {
      latitude: number;
      longitude: number;
    } | null;
  }