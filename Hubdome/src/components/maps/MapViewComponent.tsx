// src/components/maps/MapViewComponent.tsx
import React, { useRef, useState, useCallback, memo } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Map, { MapRef, Marker, NavigationControl } from '@vis.gl/react-maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Types
// import { MapMarker } from '../../types/map';
import { MapMarker, MapViewStyleType, MAP_STYLE_URLS } from "../../types/map";
const [mapViewStyle, setMapViewStyle] = useState<MapViewStyleType>('standard');

interface MapViewComponentProps {
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  markers: MapMarker[];
  userLocation?: {
    longitude: number;
    latitude: number;
  };
  mapStyle: string;
  onMarkerPress: (marker: MapMarker) => void;
  selectedMarker: MapMarker | null;
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({
  initialViewState,
  markers,
  userLocation,
  mapStyle,
  onMarkerPress,
  selectedMarker
}) => {
  const mapRef = useRef<MapRef>(null);

  // Map control functions -- add the change map style next to this here
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

  // const [mapSwitchStyle, setMapStyle] = useState<MapSwitchStyleType>('standard');

  const handleMapViewStyleChange = useCallback(() => {
    setMapViewStyle((currentStyle) => {
      switch (currentStyle) {
        case 'standard':
          return 'satellite';
        case 'satellite':
          return 'terrain';
        case 'terrain':
          return 'standard';
      }
    });
  }, []);

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
          />
        </View>
      </Marker>
    );
  }, [selectedMarker, onMarkerPress]);

  return (
    <View style={styles.container}>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        style={styles.mapContainer}
        mapStyle={mapStyle}
        mapLib={maplibregl}
      >
        <NavigationControl style={styles.navigationControl} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor="center"
          >
            <View style={styles.userLocationMarker} />
          </Marker>
        )}
        
        {/* Event/content markers */}
        {markers.map(renderMarker)}
      </Map>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={zoomIn}
          accessibilityLabel="Zoom in"
          accessibilityHint="Zooms in on the map"
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={zoomOut}
          accessibilityLabel="Zoom out"
          accessibilityHint="Zooms out on the map"
        >
          <MaterialIcons name="remove" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapControlButton}
          onPress={recenterMap}
          accessibilityLabel="Recenter map"
          accessibilityHint="Centers the map on your current location"
          disabled={!userLocation}
        >
          <MaterialIcons name="my-location" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.mapStyleButton}
        onPress={handleMapViewStyleChange}
        accessibilityLabel="Change map style"
      >
        <MaterialIcons name="layers" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
  },
  navigationControl: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: 70,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    borderRadius: 8,
    padding: 8,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  mapControlButton: {
    width: 40,
    height: 40,
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
  markerContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    width: 16,
    height: 16,
    backgroundColor: '#FF7F50',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default memo(MapViewComponent);