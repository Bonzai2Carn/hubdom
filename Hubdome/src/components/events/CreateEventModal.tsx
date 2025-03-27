// mobile/src/components/events/CreateEventModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { LocationService } from "../../services/locationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Location services
const LOCATION_CACHE_KEY = 'user:last-location';
const LOCATION_TIMESTAMP_KEY = 'user:location-timestamp';

interface CreateEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit?: (eventData: any) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  isVisible, 
  onClose,
  onSubmit 
}) => {
  // Form state
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number, longitude: number } | null>(null);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isVisible) {
      resetForm();
    }
  }, [isVisible]);
  
  // Load cached location when modal opens
  useEffect(() => {
    if (isVisible) {
      loadCachedLocation();
    }
  }, [isVisible]);
  
  const resetForm = () => {
    setEventName("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setCoordinates(null);
    setGeocodingError(null);
  };
  
  // Load the user's cached location
  const loadCachedLocation = async () => {
    try {
      const cachedLocationJson = await AsyncStorage.getItem(LOCATION_CACHE_KEY);
      
      if (cachedLocationJson) {
        const cachedLocation = JSON.parse(cachedLocationJson);
        setCoordinates({
          latitude: cachedLocation.latitude,
          longitude: cachedLocation.longitude
        });
      }
    } catch (error) {
      console.error("Failed to load cached location:", error);
    }
  };
  
  // Geocode address
  const geocodeAddress = async () => {
    if (!eventLocation.trim()) {
      setGeocodingError("Please enter a location");
      return;
    }
    
    setIsGeocodingLoading(true);
    setGeocodingError(null);
    
    try {
      // Use the LocationService to geocode the address
      const locationService = LocationService.getInstance();
      const result = await locationService.geocodeAddress(eventLocation);
      
      if (result.status === "success") {
        setCoordinates({
          latitude: result.latitude,
          longitude: result.longitude
        });
        setGeocodingError(null);
      } else {
        setGeocodingError(result.error || "Failed to geocode address");
        setCoordinates(null);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodingError("Failed to geocode address. Please try a different location.");
      setCoordinates(null);
    } finally {
      setIsGeocodingLoading(false);
    }
  };
  
  // Use current location
  const useCurrentLocation = async () => {
    setIsGeocodingLoading(true);
    setGeocodingError(null);
    
    try {
      const locationService = LocationService.getInstance();
      const location = await locationService.getCurrentLocation(true); // Force refresh
      
      if (location.status === 'success' && location.coordinates) {
        const { latitude, longitude } = location.coordinates;
        setCoordinates({ latitude, longitude });
        
        // Reverse geocode to get address
        const addressResult = await locationService.reverseGeocodeLocation(latitude, longitude);
        if (addressResult.status === 'success' && addressResult.address) {
          const address = addressResult.address;
          const formattedAddress = [
            address.street,
            address.city,
            address.state,
            address.country
          ].filter(Boolean).join(", ");
          
          setEventLocation(formattedAddress || "Current Location");
        } else {
          setEventLocation("Current Location");
        }
        
        setGeocodingError(null);
      } else {
        setGeocodingError("Failed to get current location");
      }
    } catch (error) {
      console.error("Current location error:", error);
      setGeocodingError("Failed to get current location. Please try entering an address.");
    } finally {
      setIsGeocodingLoading(false);
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (!eventName.trim()) {
      Alert.alert("Error", "Please enter an event name");
      return;
    }
    
    if (!eventDescription.trim()) {
      Alert.alert("Error", "Please add a description");
      return;
    }
    
    if (!eventDate) {
      Alert.alert("Error", "Please select a date");
      return;
    }
    
    if (!eventTime) {
      Alert.alert("Error", "Please select a time");
      return;
    }
    
    if (!eventLocation.trim() || !coordinates) {
      Alert.alert("Error", "Please enter a valid location");
      return;
    }
    
    // Prepare eventData with the geocoded coordinates
    const eventData = {
      title: eventName,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      coordinates: coordinates,
    };
    
    // Call the onSubmit callback with the event data
    if (onSubmit) {
      onSubmit(eventData);
    }
    
    // Reset form and close modal
    resetForm();
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
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalView}
        >
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
              <View style={styles.locationInputContainer}>
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
                    placeholder="Enter a location or address"
                    placeholderTextColor="#BBBBBB"
                    mode="outlined"
                    style={styles.input}
                    theme={{ colors: { primary: "#3498DB" } }}
                    onBlur={geocodeAddress}
                  />
                </View>
                
                <View style={styles.locationActions}>
                  <TouchableOpacity 
                    style={styles.locationActionButton}
                    onPress={geocodeAddress}
                    disabled={isGeocodingLoading || !eventLocation.trim()}
                  >
                    <MaterialIcons name="search" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.locationActionButton}
                    onPress={useCurrentLocation}
                    disabled={isGeocodingLoading}
                  >
                    <MaterialIcons name="my-location" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {isGeocodingLoading && (
                <View style={styles.geocodingStatus}>
                  <ActivityIndicator size="small" color="#3498DB" />
                  <Text style={styles.geocodingStatusText}>Finding location...</Text>
                </View>
              )}
              
              {geocodingError && (
                <View style={styles.geocodingStatus}>
                  <MaterialIcons name="error" size={16} color="#E74C3C" />
                  <Text style={styles.geocodingErrorText}>{geocodingError}</Text>
                </View>
              )}
              
              {coordinates && !geocodingError && !isGeocodingLoading && (
                <View style={styles.geocodingStatus}>
                  <MaterialIcons name="check-circle" size={16} color="#2ECC71" />
                  <Text style={styles.geocodingSuccessText}>Location found</Text>
                </View>
              )}
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
              style={[
                styles.button, 
                styles.submitButton,
                (!eventName || !eventLocation || !coordinates || !eventDate || !eventTime) ? styles.disabledButton : {}
              ]}
              onPress={handleSubmit}
              disabled={!eventName || !eventLocation || !coordinates || !eventDate || !eventTime}
            >
              <Text style={styles.submitButtonText}>Create Event</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(24, 24, 24, 0.7)",
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
    color: "#BBBBBB",
  },
  inputWithIcon: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationActions: {
    flexDirection: "row",
    marginLeft: 8,
  },
  locationActionButton: {
    width: 40,
    height: 40,
    backgroundColor: "#3498DB",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  geocodingStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  geocodingStatusText: {
    marginLeft: 8,
    color: "#BBBBBB",
    fontSize: 12,
  },
  geocodingErrorText: {
    marginLeft: 8,
    color: "#E74C3C",
    fontSize: 12,
  },
  geocodingSuccessText: {
    marginLeft: 8,
    color: "#2ECC71",
    fontSize: 12,
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
  disabledButton: {
    backgroundColor: "rgba(52, 152, 219, 0.5)",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CreateEventModal;