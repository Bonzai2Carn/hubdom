import React, { memo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Chip } from "react-native-paper";
import { FilterChipsProps } from "../../types/events";

const FilterChips: React.FC<FilterChipsProps> = ({
  selectedEventType,
  eventTypes,
  onSelectEventType,
}) => {
  return (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip
          selected={selectedEventType === null}
          onPress={() => onSelectEventType(null)}
          style={[
            styles.filterChip,
            selectedEventType === null && { backgroundColor: "#3498DB" },
          ]}
          textStyle={{
            color:
              selectedEventType === null ? "white" : "rgba(255,255,255,0.7)",
          }}
        >
          All
        </Chip>

        {eventTypes.map((type) => (
          <Chip
            key={type.id}
            selected={selectedEventType === type.name}
            onPress={() => onSelectEventType(type.name)}
            style={[
              styles.filterChip,
              selectedEventType === type.name && {
                backgroundColor: type.color,
              },
            ]}
            textStyle={{
              color:
                selectedEventType === type.name
                  ? "white"
                  : "rgba(255,255,255,0.7)",
            }}
          >
            {type.name}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
});

export default memo(FilterChips);
