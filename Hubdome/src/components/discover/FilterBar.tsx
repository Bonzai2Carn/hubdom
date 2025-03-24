import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FilterBarProps, ContentType } from "../../types/discover";

const FilterBar: React.FC<FilterBarProps> = ({
  contentFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            contentFilter === "all" && styles.activeFilterChip,
          ]}
          onPress={() => onFilterChange("all")}
        >
          <Text
            style={[
              styles.filterChipText,
              contentFilter === "all" && styles.activeFilterChipText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            contentFilter === "video" && styles.activeFilterChip,
          ]}
          onPress={() => onFilterChange("video")}
        >
          <Text
            style={[
              styles.filterChipText,
              contentFilter === "video" && styles.activeFilterChipText,
            ]}
          >
            Videos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            contentFilter === "audio" && styles.activeFilterChip,
          ]}
          onPress={() => onFilterChange("audio")}
        >
          <Text
            style={[
              styles.filterChipText,
              contentFilter === "audio" && styles.activeFilterChipText,
            ]}
          >
            Audio
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            contentFilter === "thread" && styles.activeFilterChip,
          ]}
          onPress={() => onFilterChange("thread")}
        >
          <Text
            style={[
              styles.filterChipText,
              contentFilter === "thread" && styles.activeFilterChipText,
            ]}
          >
            Threads
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    padding: 12,
    backgroundColor: "rgba(42, 42, 54, 0.8)",
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#1E1E2A",
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: "#3498DB",
  },
  filterChipText: {
    color: "#BBBBBB",
    fontSize: 14,
  },
  activeFilterChipText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
});

export default memo(FilterBar);
