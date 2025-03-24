// components/events/TimeSelector.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";

interface TimeSelectorProps {
  selectedTime: Date;
  onSelectTime: (time: Date) => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  selectedTime,
  onSelectTime,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Format time to 12-hour format
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) {
      onSelectTime(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(true)}
      >
        <MaterialIcons name="access-time" size={20} color="#8A56AC" />
        <Text style={styles.timeText}>{formatTime(selectedTime)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          is24Hour={false}
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
});

export default TimeSelector;