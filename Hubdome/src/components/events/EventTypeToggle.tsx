// components/events/EventTypeToggle.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface EventTypeToggleProps {
  selectedType: "public" | "private" | "paid";
  onSelectType: (type: "public" | "private" | "paid") => void;
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
          selectedType === "public" && styles.selectedToggle,
          styles.leftButton,
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
          selectedType === "paid" && styles.selectedToggle,
          styles.rightButton,
        ]}
        onPress={() => onSelectType("paid")}
      >
        <Text
          style={[
            styles.toggleText,
            selectedType === "paid" && styles.selectedToggleText,
          ]}
        >
          Paid
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
    color: "#666",
  },
  selectedToggleText: {
    color: "#FFF",
  },
});

export default EventTypeToggle;