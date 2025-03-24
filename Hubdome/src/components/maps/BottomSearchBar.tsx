// src/components/maps/BottomSearchBar.tsx
import React, { memo, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface BottomSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateContent: (type: "photo" | "audio" | "thread") => void;
}

const BottomSearchBar: React.FC<BottomSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onCreateContent
}) => {
  const searchInputRef = useRef<any>(null);

  return (
    <View 
      style={styles.bottomBarContainer}
      accessible={false}
    >
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#BBBBBB" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            placeholder="Search for events..."
            placeholderTextColor="#BBBBBB"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            theme={{ colors: { text: "#FFFFFF", primary: "#3498DB" } }}
            accessibilityLabel="Search events"
            accessibilityHint="Search for events and hobbies near you"
          />
          {searchQuery !== "" && (
            <TouchableOpacity 
              onPress={() => setSearchQuery("")}
              accessibilityLabel="Clear search"
            >
              <MaterialIcons name="close" size={20} color="#BBBBBB" />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.createContentButtons}>
          <TouchableOpacity
            style={styles.createContentButton}
            onPress={() => onCreateContent("photo")}
            accessibilityLabel="Take photo"
            accessibilityHint="Opens camera to create a photo event"
          >
            <MaterialIcons name="camera-alt" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.createContentButton}
            onPress={() => onCreateContent("audio")}
            accessibilityLabel="Record audio"
            accessibilityHint="Opens microphone to create an audio event"
          >
            <MaterialIcons name="mic" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.createContentButton}
            onPress={() => onCreateContent("thread")}
            accessibilityLabel="Create event"
            accessibilityHint="Opens form to create a text-based event"
          >
            <MaterialIcons name="create" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: "rgba(42, 42, 54, 0.8)",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: "#FFFFFF",
    backgroundColor: "transparent",
    borderWidth: 0,
  },
  createContentButtons: {
    flexDirection: "row",
    backgroundColor: "rgba(42, 42, 54, 0.8)",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  createContentButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
});

export default memo(BottomSearchBar);