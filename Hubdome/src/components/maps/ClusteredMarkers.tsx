import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from '@vis.gl/react-maplibre';
import { MapMarker } from '../../types/map';

interface ClusteredMarkersProps {
  markers: MapMarker[];
  clusterDistance: number; // Distance in pixels to cluster markers
  onMarkerPress: (marker: MapMarker) => void;
  selectedMarker: MapMarker | null;
  renderMarker: (marker: MapMarker, isSelected: boolean) => JSX.Element;
}

const ClusteredMarkers: React.FC<ClusteredMarkersProps> = ({
  markers,
  clusterDistance,
  onMarkerPress,
  selectedMarker,
  renderMarker
}) => {
  // Clustering algorithm
  const clusters = useMemo(() => {
    // This is a simplified clustering approach
    // In a production app, use a proper clustering library like supercluster
    const clusters: { markers: MapMarker[], centroid: { latitude: number, longitude: number } }[] = [];
    
    // Make a copy to avoid modifying original
    const remainingMarkers = [...markers];
    
    while (remainingMarkers.length > 0) {
      const marker = remainingMarkers.shift();
      if (!marker) continue;
      
      // Find nearby markers within cluster distance
      const nearbyMarkers = remainingMarkers.filter((m) => {
        // Simple distance calculation (would use pixel distance in real app)
        const dist = Math.sqrt(
          Math.pow(m.latitude - marker.latitude, 2) + 
          Math.pow(m.longitude - marker.longitude, 2)
        );
        return dist < (clusterDistance * 0.0001); // Approximate conversion to geo coordinates
      });
      
      // Remove nearby markers from remaining list
      nearbyMarkers.forEach(m => {
        const index = remainingMarkers.findIndex(rm => rm.id === m.id);
        if (index !== -1) remainingMarkers.splice(index, 1);
      });
      
      // If we have nearby markers, create a cluster
      if (nearbyMarkers.length > 0) {
        // Calculate centroid
        const allClusterMarkers = [marker, ...nearbyMarkers];
        const centroid = {
          latitude: allClusterMarkers.reduce((sum, m) => sum + m.latitude, 0) / allClusterMarkers.length,
          longitude: allClusterMarkers.reduce((sum, m) => sum + m.longitude, 0) / allClusterMarkers.length
        };
        
        clusters.push({
          markers: allClusterMarkers,
          centroid
        });
      } else {
        // Single marker "cluster"
        clusters.push({
          markers: [marker],
          centroid: { latitude: marker.latitude, longitude: marker.longitude }
        });
      }
    }
    
    return clusters;
  }, [markers, clusterDistance]);

  return (
    <>
      {clusters.map((cluster, index) => {
        // If this is a cluster of 1, render normal marker
        if (cluster.markers.length === 1) {
          const marker = cluster.markers[0];
          const isSelected = selectedMarker?.id === marker.id;
          return (
            <Marker
              key={marker.id}
              longitude={marker.longitude}
              latitude={marker.latitude}
              onClick={() => onMarkerPress(marker)}
            >
              {renderMarker(marker, isSelected)}
            </Marker>
          );
        }
        
        // Render a cluster marker
        return (
          <Marker
            key={`cluster-${index}`}
            longitude={cluster.centroid.longitude}
            latitude={cluster.centroid.latitude}
            onClick={() => {
              // If cluster is clicked, you could:
              // 1. Zoom in to show individual markers
              // 2. Show a popup with all markers in the cluster
              // 3. Show the most important marker in the cluster
              
              // For simplicity, let's select the first marker
              onMarkerPress(cluster.markers[0]);
            }}
          >
            <View style={styles.clusterMarker}>
              <Text style={styles.clusterText}>{cluster.markers.length}</Text>
            </View>
          </Marker>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  clusterMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  clusterText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});

export default ClusteredMarkers;