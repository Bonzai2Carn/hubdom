import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { calculateDistance } from '../../utils/geocodingUtils';

interface DistanceMarkerProps {
  marker: {
    latitude: number;
    longitude: number;
    title: string;
    subType?: string;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  isSelected: boolean;
}

const DistanceMarker: React.FC<DistanceMarkerProps> = ({
  marker,
  userLocation,
  isSelected
}) => {
  // Calculate distance if userLocation is available
  const distance = userLocation ? 
    calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      marker.latitude,
      marker.longitude
    ) : null;
  
  // Format distance for display
  const formattedDistance = distance ? 
    distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km` 
    : null;
  
  // Determine marker icon based on subType
  let markerIconName: string = 'place';
  if (marker.subType === 'video') markerIconName = 'videocam';
  if (marker.subType === 'audio') markerIconName = 'music-note';
  if (marker.subType === 'thread') markerIconName = 'forum';
  
  return (
    <View style={styles.container}>
      <View style={[styles.markerContainer, isSelected && styles.selectedMarkerContainer]}>
        <MaterialIcons
          name={'place'} //supose to be markerIconName
          size={isSelected ? 40 : 32}
          color={isSelected ? '#FF7F50' : '#3498DB'}
          style={{ transform: [{ rotate: '-45deg' }, { translateY: -10 }] }}
        />
      </View>
      
      {formattedDistance && (
        <View style={styles.distanceBadge}>
          <Text style={styles.distanceText}>{formattedDistance}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  markerContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopLeftRadius: 50,
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
  distanceBadge: {
    position: 'absolute',
    bottom: -15,
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  distanceText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default DistanceMarker;