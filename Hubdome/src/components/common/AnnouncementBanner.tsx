// src/components/common/AnnouncementBanner.tsx
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AnnouncementBannerProps {
  fadeAnim: Animated.Value;
  message: string;
  onClose: () => void;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  fadeAnim,
  message,
  onClose
}) => {
  return (
    <Animated.View 
      style={[
        styles.bannerContainer,
        { opacity: fadeAnim }
      ]}
      accessible={true}
      accessibilityLabel="Announcement banner"
      accessibilityHint="Contains important announcements or advertisements"
    >
      <View style={styles.banner}>
        <MaterialIcons name="campaign" size={24} color="#3498DB" />
        <Text style={styles.bannerText}>
          {message}
        </Text>
        <TouchableOpacity 
          onPress={onClose}
          accessibilityLabel="Close banner"
        >
          <MaterialIcons name="close" size={20} color="#BBBBBB" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? 100 : 80,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(42, 42, 54, 0.9)",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  bannerText: {
    flex: 1,
    color: "#FFFFFF",
    marginHorizontal: 10,
    fontSize: 14,
  },
});

export default memo(AnnouncementBanner);