import React, { useState, useCallback, useMemo } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform 
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

// Components
import DaySelector from "../../components/events/DaySelector";
import ParticipantSelector from "../../components/events/ParticipantSelector";
import CategorySelector from "../../components/events/CategorySelector";
import EventTypeToggle from "../../components/events/EventTypeToggle";
import TimeSelector from "../../components/events/TimeSelector";

import {EventData} from "../../types/events";
// Redux
import { createEvent } from "../../redux/actions/eventActions";
import { RootState, AppDispatch } from "../../redux/store";

const EventsScreen = () => {
  // const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  // Form states
  const [projectName, setProjectName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [eventType, setEventType] = useState<"public" | "private" | "paid">("public");
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [participants, setParticipants] = useState<string[]>([]);
  
  // Handling day selection
  const toggleDay = useCallback((day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day]
    );
  }, []);
  
  // Handle participant selection
  const addParticipant = useCallback((id: string) => {
    setParticipants(prev => [...prev, id]);
  }, []);
  
  const removeParticipant = useCallback((id: string) => {
    setParticipants(prev => prev.filter(p => p !== id));
  }, []);
  
  // Handle create task
  const handleCreateTask = useCallback(() => {
    if (!projectName || !selectedCategory) {
      // Show validation error
      return;
    }
    
    const newEvent = {
      title: projectName,
      description,
      category: selectedCategory,
      eventType,
      days: selectedDays,
      time: selectedTime.toISOString(),
      participants
    };
    
    dispatch(createEvent(newEvent as EventData));
    
    // Reset form or navigate
    setProjectName("");
    setSelectedCategory("");
    setDescription("");
    setSelectedDays([]);
    setEventType("public");
    setSelectedTime(new Date());
    setParticipants([]);
  }, [
    projectName,
    description,
    selectedCategory,
    eventType,
    selectedDays,
    selectedTime,
    participants,
    dispatch
  ]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3498DB" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hobby Event</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>Host your Hobby</Text>
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Day selector */}
          <DaySelector selectedDays={selectedDays} onToggleDay={toggleDay} />
          
          {/* Form fields */}
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Project Name"
              placeholderTextColor="#8A8A8A"
              value={projectName}
              onChangeText={setProjectName}
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Select Category</Text>
            <CategorySelector
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Event Type</Text>
            <EventTypeToggle
              selectedType={eventType}
              onSelectType={setEventType}
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Time</Text>
            <TimeSelector
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Add Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore magna aliqua."
              placeholderTextColor="#8A8A8A"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Add Participant</Text>
            <ParticipantSelector
              participants={participants}
              onAddParticipant={addParticipant}
              onRemoveParticipant={removeParticipant}
            />
          </View>
          
          {/* Create button */}
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateTask}
          >
            <Text style={styles.createButtonText}>Create New Event</Text>
            <View style={styles.arrowContainer}>
              <MaterialIcons name="arrow-forward" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8FF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#3498DB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },
  headerButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  headerButtonText: {
    color: "#FFF",
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F0F0FF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  createButton: {
    backgroundColor: "#8A56AC",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  arrowContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EventsScreen;