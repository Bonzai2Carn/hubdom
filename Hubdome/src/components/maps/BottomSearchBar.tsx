// src/components/maps/BottomSearchBar.tsx
import React, { useState, useRef, useEffect, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { LocationService } from "../../services/locationService";

interface BottomSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onCreateContent: (type: "photo" | "audio" | "thread") => void;
  onLocationSelect?: (location: {
    latitude: number;
    longitude: number;
    description: string;
  }) => void;
  onSearchMarkers?: (query: string) => void;
  markers?: Array<{
    id: string;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
  }>;
}

const BottomSearchBar: React.FC<BottomSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onCreateContent,
  onLocationSelect,
  onSearchMarkers,
  markers = []
}) => {
  const searchInputRef = useRef<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Perform search for both geocoded locations and markers
  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Search for markers matching query in title or description
      const matchingMarkers = markers.filter(marker => 
        marker.title.toLowerCase().includes(query.toLowerCase()) || 
        marker.description.toLowerCase().includes(query.toLowerCase())
      );
      
      // Search for locations using geocoding
      const locationService = LocationService.getInstance();
      const locationResult = await locationService.geocodeAddress(query);
      
      let geocodedResults: any[] = [];
      if (locationResult.status === "success") {
        // Get reverse geocode to get readable address
        const addressInfo = await locationService.reverseGeocodeLocation(
          locationResult.latitude,
          locationResult.longitude
        );
        
        const formattedAddress = addressInfo.status === "success" && addressInfo.address 
          ? [
              addressInfo.address.street,
              addressInfo.address.city,
              addressInfo.address.country
            ].filter(Boolean).join(", ")
          : query;
        
        geocodedResults = [{
          id: "location-" + Date.now(),
          type: "location",
          title: formattedAddress,
          latitude: locationResult.latitude,
          longitude: locationResult.longitude,
          description: "Location"
        }];
      }
      
      // Combine marker and geocoded results
      const formattedMarkers = matchingMarkers.map(marker => ({
        ...marker,
        type: "marker"
      }));
      
      setSearchResults([...formattedMarkers, ...geocodedResults]);
      setShowResults(true);
      
      // Call the marker search callback
      if (onSearchMarkers) {
        onSearchMarkers(query);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selection of a search result
  const handleSelectResult = (result: any) => {
    if (result.type === "location" && onLocationSelect) {
      onLocationSelect({
        latitude: result.latitude,
        longitude: result.longitude,
        description: result.title
      });
    } else if (result.type === "marker") {
      // Navigate to the marker
      // This would be implemented by zooming to the marker or selecting it
      if (onLocationSelect) {
        onLocationSelect({
          latitude: result.latitude,
          longitude: result.longitude,
          description: result.title
        });
      }
    }
    
    // Update search query and hide results
    setSearchQuery(result.title);
    setShowResults(false);
    Keyboard.dismiss();
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    Keyboard.dismiss();
  };

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
            placeholder="Search for places or events..."
            placeholderTextColor="#BBBBBB"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            theme={{ colors: { text: "#FFFFFF", primary: "#3498DB" } }}
            accessibilityLabel="Search"
            accessibilityHint="Search for locations and events near you"
            onSubmitEditing={() => performSearch(searchQuery)}
            onFocus={() => {
              if (searchQuery.length > 2) {
                setShowResults(true);
              }
            }}
          />
          {searchQuery !== "" && (
            <TouchableOpacity 
              onPress={clearSearch}
              accessibilityLabel="Clear search"
              style={styles.clearButton}
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
      
      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.searchResultItem}
                onPress={() => handleSelectResult(item)}
              >
                <MaterialIcons 
                  name={item.type === "location" ? "place" : "event-note"} 
                  size={20} 
                  color="#3498DB"
                  style={styles.resultIcon}
                />
                <View style={styles.resultTextContainer}>
                  <Text style={styles.resultTitle}>{item.title}</Text>
                  <Text style={styles.resultDescription}>
                    {item.type === "location" ? "Location" : item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      
      {/* No Results Message */}
      {showResults && searchResults.length === 0 && !isSearching && searchQuery.length > 2 && (
        <View style={styles.searchResultsContainer}>
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="search-off" size={24} color="#BBBBBB" />
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
        </View>
      )}
      
      {/* Loading Indicator */}
      {isSearching && (
        <View style={styles.searchResultsContainer}>
          <View style={styles.noResultsContainer}>
            <MaterialIcons name="hourglass-empty" size={24} color="#3498DB" />
            <Text style={styles.searchingText}>Searching...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBarContainer: {
    position: "absolute",
    bottom: 40,
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
  clearButton: {
    padding: 4,
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
  searchResultsContainer: {
    backgroundColor: "rgba(42, 42, 54, 0.95)",
    borderRadius: 10,
    marginTop: 5,
    maxHeight: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  resultIcon: {
    marginRight: 12,
  },
  resultTextContainer: {
    flex: 1,
  },
  resultTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 2,
  },
  resultDescription: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    color: "#BBBBBB",
    marginTop: 8,
  },
  searchingText: {
    color: "#3498DB",
    marginTop: 8,
  }
});

export default memo(BottomSearchBar);