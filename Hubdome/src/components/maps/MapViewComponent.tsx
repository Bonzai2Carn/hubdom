// src/components/maps/MapViewComponent.tsx
import React, { useRef, useState, useCallback, memo, forwardRef, useImperativeHandle, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import Map, { MapRef, Marker, NavigationControl } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Types
import { MapMarker, MapStyleType, MAP_STYLE_URLS } from "../../types/map";

interface MapViewComponentProps {
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
    pitch?: number;     // Add optional pitch
    bearing?: number;   // Add optional bearing
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

// Define public methods that can be called via ref
export interface MapViewComponentHandle {
  flyTo: (options: { latitude: number; longitude: number; zoom?: number }) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  recenter: () => void;
  rotateTo: (angle: number) => void;
  // Add any other required methods
}


const MapViewComponent = forwardRef<MapViewComponentHandle, MapViewComponentProps>((
  {
    initialViewState,
    markers,
    userLocation,
    mapStyle,
    onMarkerPress,
    selectedMarker,
    onStyleChange,
    onLongPress
  },
  ref
) => {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    pitch: initialViewState.pitch || 0,
    bearing: initialViewState.bearing || 0,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);


  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    flyTo: ({ longitude, latitude, zoom = 14 }) => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.flyTo({
          center: [longitude, latitude],
          zoom: zoom,
          speed: 1.5,
          curve: 1.5,
          essential: true
        });
      }
    },
    zoomIn: () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        const currentZoom = map.getZoom();
        map.zoomTo(currentZoom + 1, { duration: 300 });
      }
    },
    zoomOut: () => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        const currentZoom = map.getZoom();
        map.zoomTo(Math.max(currentZoom - 1, 0), { duration: 300 });
      }
    },
    recenter: () => {
      if (mapRef.current && userLocation) {
        const map = mapRef.current.getMap();
        map.flyTo({
          center: [userLocation.longitude, userLocation.latitude],
          speed: 1.5,
          zoom: initialViewState.zoom,
          essential: true
        });
      }
    },
    rotateTo: (angle: number) => {
      if (mapRef.current) {
        const map = mapRef.current.getMap();
        map.rotateTo(angle, { duration: 300 });
      }
    }
  }));

  // Collapse/expand map controls
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  // Map control functions
  const zoomIn = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentZoom = map.getZoom();
      map.zoomTo(currentZoom + 1, { duration: 300 });
    }
  }, []);

  const zoomOut = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentZoom = map.getZoom();
      map.zoomTo(Math.max(currentZoom - 1, 0), { duration: 300 });
    }
  }, []);

  const recenterMap = useCallback(() => {
    if (mapRef.current && userLocation) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        speed: 1,
        zoom: initialViewState.zoom,
      });
    }
  }, [userLocation, initialViewState.zoom]);

  // Fly to a specific location
  const flyToLocation = useCallback((longitude: number, latitude: number, zoom: number = 15) => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [longitude, latitude],
        zoom: zoom,
        speed: 1.2,
        curve: 1.5,
        essential: true
      });
    }
  }, []);

  // Toggle isometric projection
  const toggleIsometricView = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const newPitch = viewState.pitch === 0 ? 60 : 0;

      map.easeTo({
        pitch: newPitch,
        duration: 500
      });

      setViewState(prev => ({
        ...prev,
        pitch: newPitch
      }));
    }
  }, [viewState.pitch]);

  // Handle style change
  const handleStyleChange = useCallback(() => {
    if (onStyleChange) {
      onStyleChange();
    }
  }, [onStyleChange]);

  // Add these rotation control functions
  const rotateLeft = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentBearing = map.getBearing();
      const newBearing = currentBearing - 15;

      map.rotateTo(newBearing, { duration: 300 });

      setViewState(prev => ({
        ...prev,
        bearing: newBearing
      }));
    }
  }, []);

  const rotateRight = useCallback(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentBearing = map.getBearing();
      const newBearing = currentBearing + 15;

      map.rotateTo(newBearing, { duration: 300 });

      setViewState(prev => ({
        ...prev,
        bearing: newBearing
      }));
    }
  }, []);

  // Add useEffect for initial isometric view
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      // Wait for map to be loaded
      map.once('load', () => {
        // Set initial isometric view
        map.easeTo({
          pitch: initialViewState.pitch || 60,
          bearing: initialViewState.bearing || 15,
          duration: 1000
        });
      });
    }
  }, [initialViewState.pitch, initialViewState.bearing]);

  // add useEffect for collapsed items
  useEffect(() => {
    if (mapRef.current) {
      // Give the DOM time to update before resizing the map
      setTimeout(() => {
        const map = mapRef.current?.getMap();
        if (map) {
          map.resize();
        }
      }, 100);
    }
  }, [isCollapsed]);

  // handle long press gesture
  const handleMapLongPress = useCallback((event: any) => {
    if (onLongPress && event.lngLat) {
      // Convert the coordinates to the format expected by our event creation
      onLongPress({
        latitude: event.lngLat[1],
        longitude: event.lngLat[0]
      });
    }
  }, [onLongPress]);

  // Render a map marker
  const renderMarker = useCallback((marker: MapMarker) => {
    const isSelected = selectedMarker?.id === marker.id;
    let markerIconName: string = 'place';
    if (marker.subType === 'video') markerIconName = 'videocam';
    if (marker.subType === 'audio') markerIconName = 'music-note';
    if (marker.subType === 'thread') markerIconName = 'forum';

    return (
      <Marker
        key={marker.id}
        longitude={marker.longitude}
        latitude={marker.latitude}
        anchor="center"
        onClick={() => onMarkerPress(marker)}
      >
        <View style={[styles.markerContainer, isSelected && styles.selectedMarkerContainer]}>
          <MaterialIcons
            name={markerIconName as any}
            size={isSelected ? 32 : 24}
            color={isSelected ? '#FF7F50' : '#3498DB'}
            style={{ transform: [{ rotate: '-45deg' }] }}
          />
        </View>
      </Marker>
    );
  }, [selectedMarker, onMarkerPress]);

  return (
    <View style={[styles.container, isCollapsed && styles.collapsedContainer]}>
      <Map
        ref={mapRef}
        initialViewState={{
          ...initialViewState,
          pitch: viewState.pitch,
          bearing: viewState.bearing,
        }}
        style={styles.mapContainer}
        mapStyle={mapStyle}
        mapLib={maplibregl}
        onDblClick={handleMapLongPress} // For the web version
        onClick={(e) => {
          // We'll use a timer to determine if it's a long press
          if (e.originalEvent.type === 'pointerdown') {
            const timer = setTimeout(() => {
              handleMapLongPress(e);
            }, 2000); // 2 seconds for long press

            // Clear the timer if the user moves or releases before 2 seconds
            const clearTimer = () => {
              clearTimeout(timer);
              document.removeEventListener('pointermove', clearTimer);
              document.removeEventListener('pointerup', clearTimer);
            };

            document.addEventListener('pointermove', clearTimer, { once: true });
            document.addEventListener('pointerup', clearTimer, { once: true });
          }
        }}
      >
        <NavigationControl style={styles.navigationControl} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            longitude={userLocation.longitude} //will use an avatar for the user location
            latitude={userLocation.latitude}
            anchor="center"
          >
            <View style={[styles.userLocationMarker, { transform: [{ rotate: '45deg' }] }]} />
          </Marker>
        )}

        {/* Event/content markers */}
        {markers.map(renderMarker)}
      </Map>
      

      {/* Map Controls */}
      
      <View style={styles.mapControls}>
        <TouchableOpacity
        style={styles.mapControlButton && styles.collapsedContainer}
        onPress={toggleCollapse}
        accessibilityLabel={isCollapsed ? "Expand map" : "Collapse map"}
      >
        <MaterialIcons
          name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      {!isCollapsed && (
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={zoomIn}
          accessibilityLabel="Zoom in"
          accessibilityHint="Zooms in on the map"
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>)}
        {!isCollapsed && (
          <TouchableOpacity
          style={styles.mapControlButton}
          onPress={zoomOut}
          accessibilityLabel="Zoom out"
          accessibilityHint="Zooms out on the map"
        >
          <MaterialIcons name="remove" size={24} color="#FFFFFF" />
        </TouchableOpacity>)}
        {!isCollapsed && (
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={recenterMap}
          accessibilityLabel="Recenter map"
          accessibilityHint="Centers the map on your current location"
          disabled={!userLocation}
        >
          <MaterialIcons name="my-location" size={24} color="#FFFFFF" />
        </TouchableOpacity>)}
        {!isCollapsed && (
          <TouchableOpacity
          style={styles.mapControlButton}
          onPress={toggleIsometricView}
          accessibilityLabel="Toggle isometric view"
          accessibilityHint="Switches between flat and angled perspective"
        >
          <MaterialIcons
            name={viewState.pitch > 0 ? "crop-rotate" : "3d-rotation"}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity> )}
        {!isCollapsed && (
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={rotateLeft}
          accessibilityLabel="Rotate left"
          accessibilityHint="Rotates the map counter-clockwise"
        >
          <MaterialIcons name="rotate-right" size={24} color="#FFFFFF" />
        </TouchableOpacity>)}
        {!isCollapsed && (

        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={rotateRight}
          accessibilityLabel="Rotate right"
          accessibilityHint="Rotates the map clockwise"
        >
          <MaterialIcons name="rotate-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>)}
        {!isCollapsed && (
        <TouchableOpacity
          style={styles.mapStyleButton}
          onPress={handleStyleChange}
          accessibilityLabel="Change map style"
        >
          <MaterialIcons name="layers" size={24} color="#FFFFFF" />
        </TouchableOpacity>)}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  // collapsed container style
  collapsedContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    // padding: 5,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
  },

  // navigation styles
  mapContainer: {
    flex: 1,
  },

  navigationControl: {
    position: 'absolute',
    top: 10,
    left: 40,
  },
  mapControls: {
    position: 'absolute',
    right: 15,
    top: 100,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    borderTopStartRadius: 20,
    borderTopEndRadius: 10,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 20,
    padding: 8,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    alignItems: 'center',
  },
  mapControlButton: {
    width: 30,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  mapStyleButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },

  // marker styles
  markerContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
  },
  selectedMarkerContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#FF7F50',
    backgroundColor: 'rgba(42, 42, 54, 0.9)',
  },
  userLocationMarker: {
    width: 36,
    height: 36,
    backgroundColor: '#FF7F50',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',

  },
  rotationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
    marginVertical: 4,
  },
});

export default memo(MapViewComponent);