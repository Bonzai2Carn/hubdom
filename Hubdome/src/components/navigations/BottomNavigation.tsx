// src/components/navigations/BottomNavigation.tsx
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type TabName = 'map' | 'discover' | 'events' | 'comms' | 'profile';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: TabName) => void;
  onCreateClick?: () => void;
}

interface TabItem {
  name: TabName;
  label: string;
  icon: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onCreateClick
}) => {
  // Define tabs configuration
  const tabs: TabItem[] = [
    { name: 'map', label: 'Map', icon: 'map' },
    { name: 'discover', label: 'Discover', icon: 'explore' },
    { name: 'events', label: 'Events', icon: 'stream' },
    { name: 'comms', label: 'Community', icon: 'nature_people' },
    { name: 'profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={[styles.navItem, activeTab === tab.name && styles.activeNavItem]}
          onPress={() => onTabChange(tab.name)}
          accessibilityLabel={`${tab.label} tab`}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === tab.name }}
        >
          <MaterialIcons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.name ? "#3498DB" : "#FFFFFF"}
          />
          <Text
            style={[
              styles.navText,
              activeTab === tab.name && styles.activeNavText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "rgba(42, 42, 54, 0.95)",
    height: 65,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    zIndex: 2,
  },
  navItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: "#3498DB",
    backgroundColor: "rgba(52, 152, 219, 0.1)",
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: "#FFFFFF",
  },
  activeNavText: {
    color: "#3498DB",
  },
});

export default memo(BottomNavigation);