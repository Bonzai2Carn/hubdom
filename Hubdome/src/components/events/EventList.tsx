import React, { memo } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { EventListProps } from "../../types/events";

// Import components
import EventCard from "./EventCard";
import EmptyState from "../../screens/events/EmptyState";

const EventList: React.FC<EventListProps> = ({
  loading,
  filteredEvents,
  searchQuery,
  selectedEventType,
  onToggleAttendance,
  onEventPress,
  onClearFilters,
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filteredEvents}
      renderItem={({ item }) => (
        <EventCard
          item={item}
          onToggleAttendance={onToggleAttendance}
          onPress={onEventPress}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={
        <EmptyState
          searchQuery={searchQuery}
          selectedEventType={selectedEventType}
          onClearFilters={onClearFilters}
        />
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
  },
});

export default memo(EventList);
