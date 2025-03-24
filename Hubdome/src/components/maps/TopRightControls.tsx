// src/components/maps/TopRightControls.tsx
import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TopRightControlsProps {
  onProfilePress: () => void;
  onNotificationsPress: () => void;
  hasNotifications?: boolean;
}

const TopRightControls: React.FC<TopRightControlsProps> = ({
  onProfilePress,
  onNotificationsPress,
  hasNotifications = true
}) => {
  return (
    <View style={styles.topRightControls} accessible={false}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onProfilePress}
        accessibilityLabel="Open Profile"
        accessibilityHint="Opens your profile sidebar"
      >
        <View style={styles.notificationContainer}>
          {hasNotifications && <View style={styles.notificationBadge} />}
          <MaterialIcons name="person" size={24} color="#FFFFFF" />
        </View>

      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onNotificationsPress}
        accessibilityLabel="Open Notifications"
        accessibilityHint="Opens your notifications sidebar"
      >
        <View style={styles.notificationContainer}>
          {hasNotifications && <View style={styles.notificationBadge} />}
          <MaterialIcons name="notifications" size={24} color="#FFFFFF" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  topRightControls: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  iconButton: {
    marginLeft: 15,
    backgroundColor: "rgba(42, 42, 54, 0.8)",
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  notificationContainer: {
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF7F50",
    zIndex: 1,
    borderWidth: 1,
    borderColor: "#2A2A36",
  },
});

export default memo(TopRightControls);