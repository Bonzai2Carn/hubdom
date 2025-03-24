// src/components/maps/MarkerDetailPopup.tsx
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MapMarker } from '../../types/map';

interface MarkerDetailPopupProps {
  marker: MapMarker;
  onClose: () => void;
  onViewDetails: () => void;
  onJoin: () => void;
}

const MarkerDetailPopup: React.FC<MarkerDetailPopupProps> = ({
  marker,
  onClose,
  onViewDetails,
  onJoin
}) => {
  // Get appropriate icon based on marker type
  const getIconName = (): string => {
    switch (marker.subType) {
      case 'video':
        return 'videocam';
      case 'audio':
        return 'music-note';
      case 'thread':
        return 'forum';
      default:
        return 'place';
    }
  };

  return (
    <View
      style={styles.markerPopup}
      accessible={true}
      accessibilityLabel={`Event: ${marker.title}`}
      accessibilityHint="Shows details about the selected event"
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
        accessibilityLabel="Close popup"
      >
        <MaterialIcons name="close" size={20} color="#BBBBBB" />
      </TouchableOpacity>
      
      <View style={styles.markerPopupHeader}>
        <View style={styles.markerTypeIndicator}>
          <MaterialIcons 
            name={getIconName() as any} 
            size={20} 
            color="#FFFFFF" 
          />
        </View>
        <Text style={styles.markerTitle}>{marker.title}</Text>
      </View>
      
      <Text style={styles.markerDescription}>{marker.description}</Text>
      
      <View style={styles.markerMeta}>
        <Text style={styles.markerMetaText}>
          Created by {marker.createdBy} • {new Date(marker.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.markerActions}>
        <TouchableOpacity
          style={styles.markerActionButton}
          onPress={onViewDetails}
          accessibilityLabel="View details"
        >
          <MaterialIcons name="info" size={18} color="#FFFFFF" />
          <Text style={styles.markerActionText}>Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.markerActionButton, styles.markerActionButtonAccent]}
          onPress={onJoin}
          accessibilityLabel="Join event"
        >
          <MaterialIcons name="person-add" size={18} color="#FFFFFF" />
          <Text style={styles.markerActionText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  markerPopup: {
    position: "absolute",
    bottom: 170,
    left: 20,
    right: 20,
    backgroundColor: "rgba(42, 42, 54, 0.95)",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 3,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 4,
  },
  markerPopupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  markerTypeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3498DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  markerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  markerDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 12,
    lineHeight: 20,
  },
  markerMeta: {
    marginBottom: 16,
  },
  markerMetaText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  markerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  markerActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498DB",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  markerActionButtonAccent: {
    backgroundColor: "#FF7F50",
  },
  markerActionText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 6,
  },
});

export default memo(MarkerDetailPopup);