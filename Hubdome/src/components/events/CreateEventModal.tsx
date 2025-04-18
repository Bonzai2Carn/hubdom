// src/components/events/CreateEventModal.tsx
import React, { useState, useEffect, useCallback } from "react";
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
  KeyboardAvoidingView,
  FlatList,
  Image
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import DaySelector from "../../components/events/DaySelector";
import ParticipantSelector from "../../components/events/ParticipantSelector";
import CategorySelector from "../../components/events/CategorySelector";
import EventTypeToggle from "../../components/events/EventTypeToggle";
import TimeSelector from "../../components/events/TimeSelector";
// Removed unused DateTimePicker import
import { LocationService } from "../../services/locationService";
import { performLocationSearch, LocationSearchResult } from "../../utils/geocodingUtils";


// Location services

// Update the interface to include initial location coordinates and address
interface CreateEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit?: (eventData: any) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    // address?: string;
  } | null;
}

interface LocationSuggestion {
  id: string;
  description: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  placeName?: string;
}

interface EventData {
  title: string;
  description: string;
  category: string;
  days: number[];
  duration: number;
  eventType: 'solo' | 'private' | 'public';
  location: {
    coordinates: [number, number];
    formattedAddress: string;
  };
  media?: {
    type: 'image' | 'video';
    uri: string;
  };
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ 
  isVisible, 
  onClose,
  onSubmit,
  initialLocation
}) => {
  // Form state
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [days, setDays] = useState<number[]>([]);
  const [duration, setDuration] = useState(60); // minutes
  const [eventType, setEventType] = useState<'solo' | 'private' | 'public'>('public');
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  // Location state
  const [eventLocation, setEventLocation] = useState("");
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSearchResult[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [locationSearchTimeout, setLocationSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
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
  
  // Add effect to handle initial location when modal opens
  useEffect(() => {
    const handleInitialLocation = async () => {
      if (isVisible && initialLocation) {
        // Set coordinates immediately
        setCoordinates({
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude
        });

        // If address is provided, use it directly
        // if (initialLocation.address) {
        //   setEventLocation(initialLocation.address);
        //   return;
        // }

        // Otherwise, reverse geocode the coordinates
        try {
          const locationService = LocationService.getInstance();
          const addressInfo = await locationService.reverseGeocodeLocation(
            initialLocation.latitude,
            initialLocation.longitude
          );

          if (addressInfo.status === 'success' && addressInfo.address) {
            const formattedAddress = [
              addressInfo.address.street,
              addressInfo.address.city,
              addressInfo.address.state,
              addressInfo.address.country
            ].filter(Boolean).join(", ");

            setEventLocation(formattedAddress || "Selected Location");
          } else {
            setEventLocation("Selected Location");
          }
        } catch (error) {
          console.error("Error getting address for initial location:", error);
          setEventLocation("Selected Location");
        }
      }
    };

    handleInitialLocation();
  }, [isVisible, initialLocation]);
  
  // Handle location search debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (eventLocation.length > 2 && isVisible) {
        searchLocations(eventLocation);
      } else {
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [eventLocation, isVisible]);
  
  useEffect(() => {
    if (locationSearchTimeout) {
      clearTimeout(locationSearchTimeout);
    }
    
    if (eventLocation.length > 2) {
      const timeout = setTimeout(() => {
        searchLocations(eventLocation);
      }, 500);
      
      setLocationSearchTimeout(timeout);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
    
    return () => {
      if (locationSearchTimeout) {
        clearTimeout(locationSearchTimeout);
      }
    };
  }, [eventLocation, searchLocations]);
  
  const resetForm = () => {
    setEventName("");
    setCategory("");
    setDescription("");
    setDays([]);
    setEventType("public");
    setSelectedTime(new Date());
    // setParticipants([]);
    setEventLocation("");
    setCoordinates(null);
    setGeocodingError(null);
    setLocationSuggestions([]);
    setShowLocationSuggestions(false);
  };
  
  // Load the user's cached location
  const loadCachedLocation = async () => {
    try {
      const locationService = LocationService.getInstance();
      const location = await locationService.getCurrentLocation(false);
      
      if (location.status === 'success' && location.coordinates) {
        setCoordinates({
          latitude: location.coordinates.latitude,
          longitude: location.coordinates.longitude
        });
        
        // Optionally get a readable address for the location
        try {
          const addressInfo = await locationService.reverseGeocodeLocation(
            location.coordinates.latitude,
            location.coordinates.longitude
          );
          
          if (addressInfo.status === 'success' && addressInfo.address) {
            const formattedAddress = [
              addressInfo.address.street,
              addressInfo.address.city,
              addressInfo.address.state,
              addressInfo.address.country
            ].filter(Boolean).join(", ");
            
            if (formattedAddress) {
              setEventLocation(formattedAddress);
            }
          }
        } catch (error) {
          console.error("Error getting address:", error);
        }
      }
    } catch (error) {
      console.error("Failed to load cached location:", error);
    }
  };
  
  // Search for location suggestions
  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }
    
    setIsGeocodingLoading(true);
    setGeocodingError(null);
    
    try {
      // Use the shared utility function
      const results = await performLocationSearch(query, {
        userLocation: coordinates, // Pass current coordinates if available
        radius: 50 // Default radius in km
      });
      
      setLocationSuggestions(results);
      setShowLocationSuggestions(results.length > 0);
      setGeocodingError(null);
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodingError("Failed to find matching locations");
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    } finally {
      setIsGeocodingLoading(false);
    }
  }, [coordinates]);
  
  // Select a location suggestion
  const selectLocationSuggestion = (suggestion: LocationSuggestion) => {
    setEventLocation(suggestion.formattedAddress || suggestion.description);
    setCoordinates({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    });
    setShowLocationSuggestions(false);
    setGeocodingError(null);
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
        setShowLocationSuggestions(false);
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

  // Date & Time Handlers
  const handleDayToggle = useCallback((day: number) => {
    setDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  }, []);

  // // Handle participant management
  // const handleAddParticipant = useCallback((id: string) => {
  //   setParticipants(prev => [...prev, id]);
  // }, []);
  
  // const handleRemoveParticipant = useCallback((id: string) => {
  //   setParticipants(prev => prev.filter(p => p !== id));
  // }, []);

  // -----------------------------------------
  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || eventTime;
    setShowTimePicker(Platform.OS === 'ios');
    setEventTime(currentTime);
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Format time for display
  const formatTime = (time: Date): string => {
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleMediaUpload = async (type: 'image' | 'video') => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow access to your media library");
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setMediaType(type);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to upload media');
    }
  };
  
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow access to your camera");
        return;
      }
  
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
        setMediaType('image');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const validateForm = () => {
    if (!eventName.trim()) {
      Alert.alert("Error", "Please enter an event name");
      return false;
    }
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return false;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please add a description");
      return false;
    }
    if (days.length === 0) {
      Alert.alert("Error", "Please select at least one day");
      return false;
    }
    if (!eventLocation || !coordinates) {
      Alert.alert("Error", "Please select a valid location");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
  
    const eventData: EventData = {
      title: eventName,
      description,
      category,
      days,
      duration,
      eventType,
      location: {
        coordinates: [coordinates!.longitude, coordinates!.latitude],
        formattedAddress: eventLocation
      },
      ...(mediaUri && {
        media: {
          type: mediaType === 'none' ? 'image' : mediaType,
          uri: mediaUri
        }
      })
    };
  
    if (onSubmit) {
      onSubmit(eventData);
    }
    
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
                textColor="#FFFFFF"              />
            </View>

            {/* Category Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <CategorySelector
                selectedCategory={category}
                onSelectCategory={setCategory}
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your event"
                placeholderTextColor="#BBBBBB"
                mode="outlined"
                multiline={true}
                numberOfLines={4}
                style={styles.input}
                textColor="#FFFFFF"              />
            </View>

            {/* Day Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Days</Text>
              <DaySelector
                selectedDays={days}
                onToggleDay={handleDayToggle}
              />
            </View>

            {/* Time Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Time</Text>
              <TimeSelector
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
              />
            </View>

            {/* Event Type Toggle */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Event Type</Text>
              <EventTypeToggle
                selectedType={eventType}
                onSelectType={setEventType}
              />
            </View>

            {/* Participants Selector (only if not solo) */}
            {/* {eventType !== "solo" && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Add Participants</Text>
                <ParticipantSelector
                  participants={participants}
                  onAddParticipant={handleAddParticipant}
                  onRemoveParticipant={handleRemoveParticipant}
                />
              </View>
            )} */}

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
                    textColor="#FFFFFF"                    onFocus={() => {
                      if (eventLocation.length > 2) {
                        setShowLocationSuggestions(true);
                      }
                    }}
                  />
                
                  <TouchableOpacity 
                    style={styles.currentLocationButton}
                    onPress={useCurrentLocation}
                    disabled={isGeocodingLoading}
                  >
                    <MaterialIcons name="my-location" size={20} color="#3498DB" />
                  </TouchableOpacity>
                </View>
                
                {/* Location suggestions dropdown */}
                {showLocationSuggestions && locationSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                      data={locationSuggestions}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.suggestionItem}
                          onPress={() => selectLocationSuggestion(item)}
                        >
                          <MaterialIcons name="place" size={16} color="#3498DB" />
                          <Text style={styles.suggestionText}>
                            {item.formattedAddress || item.description}
                          </Text>
                        </TouchableOpacity>
                      )}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                )}
                
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
                (!eventName || !eventLocation || !coordinates) ? styles.disabledButton : {}
              ]}
              onPress={handleSubmit}
              disabled={!eventName || !eventLocation || !coordinates}
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
    maxHeight: "90%",
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
    maxHeight: "70%",
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
    color: "#ffffff",
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
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(30, 30, 42, 0.8)",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  dateTimeText: {
    color: "#FFFFFF",
    marginLeft: 8,
  },
  locationInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currentLocationButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(30, 30, 42, 0.8)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  suggestionsContainer: {
    backgroundColor: "rgba(30, 30, 42, 0.95)",
    borderRadius: 5,
    marginTop: 4,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  suggestionText: {
    color: "#FFFFFF",
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