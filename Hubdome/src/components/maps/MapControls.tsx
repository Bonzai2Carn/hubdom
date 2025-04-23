import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MapControlsProps } from '../../types/map';

const { width, height } = Dimensions.get('window');

export const MapControls: React.FC<MapControlsProps> = ({
  mapRef,
  isCollapsed,
  toggleCollapse,
  viewState,
  setViewState,
  userLocation,
  onStyleChange
}) => {
  const zoomIn = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentZoom = map.getZoom();
      map.zoomTo(currentZoom + 1, { duration: 300 });
    }
  };

  const zoomOut = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const currentZoom = map.getZoom();
      map.zoomTo(Math.max(currentZoom - 1, 0), { duration: 300 });
    }
  };

  const recenterMap = () => {
    if (mapRef.current && userLocation) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        speed: 1,
        zoom: 14,
      });
    }
  };

  const toggleIsometricView = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const newPitch = viewState.pitch === 0 ? 60 : 0;

      map.easeTo({
        pitch: newPitch,
        duration: 500
      });

      setViewState({ ...viewState, pitch: newPitch });
    }
  };

  return (
    <View style={styles.mapControls}>
      <TouchableOpacity
        style={[styles.mapControlButton, isCollapsed && styles.collapsedButton]}
        onPress={toggleCollapse}
      >
        <MaterialIcons
          name={isCollapsed ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {!isCollapsed && (
        <>
          <TouchableOpacity style={styles.mapControlButton} onPress={zoomIn}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.mapControlButton} onPress={zoomOut}>
            <MaterialIcons name="remove" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mapControlButton} 
            onPress={recenterMap}
            disabled={!userLocation}
          >
            <MaterialIcons name="my-location" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.mapControlButton} 
            onPress={toggleIsometricView}
          >
            <MaterialIcons
              name={viewState.pitch > 0 ? "crop-rotate" : "3d-rotation"}
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {onStyleChange && (
            <TouchableOpacity
              style={styles.mapStyleButton}
              onPress={onStyleChange}
            >
              <MaterialIcons name="layers" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mapControls: {
    position: 'absolute',
    right: width * 0.05,
    top: height * 0.15,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    borderRadius: 12,
    padding: 8,
    zIndex: 1,
    elevation: 5,
    alignItems: 'center',
  },
  mapControlButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  collapsedButton: {
    backgroundColor: 'transparent',
  },
  mapStyleButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
});

export default React.memo(MapControls);