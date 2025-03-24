import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { DiscoverHeaderProps } from "../../types/discover";

const DiscoverHeader: React.FC<DiscoverHeaderProps> = ({
  currentTab,
  showSearchBar,
  onToggleSearchBar,
  onToggleViewMode,
  onToggleCurrentTab,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>
          {currentTab === "discover" ? "Discover" : "Fork-Board"}
        </Text>
      </View>

      <View style={styles.headerRight}>
        {!showSearchBar && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onToggleSearchBar}
          >
            <MaterialIcons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.headerButton}
          onPress={onToggleViewMode}
        >
          <MaterialIcons
            name={currentTab === "discover" ? "dashboard" : "grid-view"}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={onToggleCurrentTab}
        >
          <MaterialIcons
            name={currentTab === "discover" ? "bookmark-border" : "explore"}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2A2A36",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    marginLeft: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});

export default memo(DiscoverHeader);
