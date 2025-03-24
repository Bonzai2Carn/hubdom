// components/events/DaySelector.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface DaySelectorProps {
  selectedDays: number[]; // 0-6 for Sunday to Saturday
  onToggleDay: (day: number) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDays, onToggleDay }) => {
  const days = [
    { short: "S", value: 0, full: "Sunday" },
    { short: "M", value: 1, full: "Monday" },
    { short: "T", value: 2, full: "Tuesday" },
    { short: "W", value: 3, full: "Wednesday" },
    { short: "T", value: 4, full: "Thursday" },
    { short: "F", value: 5, full: "Friday" },
    { short: "S", value: 6, full: "Saturday" },
  ];

  return (
    <View style={styles.container}>
      {days.map((day) => (
        <TouchableOpacity
          key={day.value}
          style={[
            styles.dayButton,
            selectedDays.includes(day.value) && styles.selectedDayButton,
          ]}
          onPress={() => onToggleDay(day.value)}
          accessibilityLabel={day.full}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedDays.includes(day.value) }}
        >
          <Text
            style={[
              styles.dayText,
              selectedDays.includes(day.value) && styles.selectedDayText,
            ]}
          >
            {day.short}
          </Text>
          <Text
            style={[
              styles.dayNumber,
              selectedDays.includes(day.value) && styles.selectedDayText,
            ]}
          >
            {18 + day.value}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dayButton: {
    width: 36,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayButton: {
    backgroundColor: "#8A56AC",
  },
  dayText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  selectedDayText: {
    color: "#FFF",
  },
});

export default DaySelector;