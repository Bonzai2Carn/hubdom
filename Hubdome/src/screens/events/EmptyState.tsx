import React, { memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { EmptyStateProps } from "../../types/events";

const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  selectedEventType,
  onClearFilters,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <MaterialIcons
        name="event-busy"
        size={64}
        color="rgba(255,255,255,0.2)"
      />
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery || selectedEventType
          ? "Try a different search term or filter"
          : "Join or create an event to get started"}
      </Text>

      {(searchQuery || selectedEventType) && (
        <Button
          mode="contained"
          onPress={onClearFilters}
          style={{ marginTop: 16, backgroundColor: "#3498DB" }}
        >
          Clear Filters
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 8,
  },
});

export default memo(EmptyState);
