import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

interface TabsBarProps {
  activeTab: 'forYou' | 'trending' | 'nearYou';
  onTabChange: (tab: 'forYou' | 'trending' | 'nearYou') => void;
}

const TabsBar: React.FC<TabsBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[styles.tab, activeTab === "forYou" && styles.activeTab]}
        onPress={() => onTabChange("forYou")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "forYou" && styles.activeTabText,
          ]}
        >
          For You
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === "trending" && styles.activeTab]}
        onPress={() => onTabChange("trending")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === "trending" && styles.activeTabText,
          ]}
        >
          Trending
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === "nearYou" && styles.activeTab]}
        onPress={() => onTabChange("nearYou")}
      >
        <View style={styles.tabWithIcon}>
          <MaterialIcons
            name="place"
            size={16} 
            color={activeTab === "nearYou" ? "#3498DB" : "#BBBBBB"} 
            style={styles.tabIcon}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "nearYou" && styles.activeTabText,
            ]}
          >
            Near You
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#2A2A36",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498DB",
  },
  tabText: {
    fontSize: 14,
    color: "#BBBBBB",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3498DB",
    fontWeight: "bold",
  },
  tabWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabIcon: {
    marginRight: 4,
  }
});

export default memo(TabsBar);