import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

// Define prop types
interface CreateEventModalProps {
    isVisible: boolean;
    onClose: () => void;
    onSubmit?: (eventData: any) => void;
  }

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isVisible, onClose }) => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");

  const handleSubmit = () => {
    // Handle event creation logic here
    console.log({
      name: eventName,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
    });

    // Reset form
    setEventName("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");

    // Close modal
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Hobby Event</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#BBBBBB" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Event Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Event Name</Text>
              <TextInput
                value={eventName}
                onChangeText={setEventName}
                placeholder="Enter event name"
                placeholderTextColor="#BBBBBB"
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: "#3498DB" } }}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                value={eventDescription}
                onChangeText={setEventDescription}
                placeholder="Describe your event"
                placeholderTextColor="#BBBBBB"
                mode="outlined"
                multiline={true}
                numberOfLines={4}
                style={styles.input}
                theme={{ colors: { primary: "#3498DB" } }}
              />
            </View>

            {/* Date & Time */}
            <View style={styles.rowContainer}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Date</Text>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons
                    name="event"
                    size={20}
                    color="#BBBBBB"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={eventDate}
                    onChangeText={setEventDate}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor="#BBBBBB"
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: "#3498DB" } }}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>Time</Text>
                <View style={styles.inputWithIcon}>
                  <MaterialIcons
                    name="access-time"
                    size={20}
                    color="#BBBBBB"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={eventTime}
                    onChangeText={setEventTime}
                    placeholder="HH:MM AM/PM"
                    placeholderTextColor="#BBBBBB"
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: "#3498DB" } }}
                  />
                </View>
              </View>
            </View>

            {/* Location */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <View style={styles.inputWithIcon}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color="#BBBBBB"
                  style={styles.inputIcon}
                />
                <TextInput
                  value={eventLocation}
                  onChangeText={setEventLocation}
                  placeholder="Enter location or drop pin on map"
                  placeholderTextColor="#BBBBBB"
                  mode="outlined"
                  style={styles.input}
                  theme={{ colors: { primary: "#3498DB" } }}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#2A2A36",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: "#BBBBBB",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: "#1E1E2A",
  },
  inputWithIcon: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    zIndex: 1,
    left: 12,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#BBBBBB",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#3498DB",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CreateEventModal;
