// components/events/EventTypeToggle.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface EventTypeToggleProps {
  selectedType: "solo" | "private" | "public";
  onSelectType: (type: "solo" | "private" | "public") => void;
}

const EventTypeToggle: React.FC<EventTypeToggleProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          selectedType === "solo" && styles.selectedToggle,
          styles.leftButton,
        ]}
        onPress={() => onSelectType("solo")}
      >
        <Text
          style={[
            styles.toggleText,
            selectedType === "solo" && styles.selectedToggleText,
          ]}
        >
          Solo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          selectedType === "private" && styles.selectedToggle,
          styles.middleButton,
        ]}
        onPress={() => onSelectType("private")}
      >
        <Text
          style={[
            styles.toggleText,
            selectedType === "private" && styles.selectedToggleText,
          ]}
        >
          Private
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          selectedType === "public" && styles.selectedToggle,
          styles.rightButton,
        ]}
        onPress={() => onSelectType("public")}
      >
        <Text
          style={[
            styles.toggleText,
            selectedType === "public" && styles.selectedToggleText,
          ]}
        >
          Public
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F0F0FF",
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  leftButton: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  middleButton: {},
  rightButton: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  selectedToggle: {
    backgroundColor: "#8A56AC",
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  selectedToggleText: {
    color: "#FFFFFF",
  },
});

export default EventTypeToggle;