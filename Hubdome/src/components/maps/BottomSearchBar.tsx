// src/components/maps/BottomSearchBar.tsx
import React, { useState, useRef, useEffect, memo } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, Text, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  performLocationSearch, 
  calculateDistance, 
  LocationSearchResult,
  SearchOptions 
} from '../../utils/geocodingUtils';

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
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onFlyTo?: (location: { longitude: number; latitude: number; zoom?: number }) => void;
  searchRadius?: number; // in kilometers, default will be 50
}

// Add new interface for search state
interface SearchState {
  query: string;
  radius: number;
  results: LocationSearchResult[];
}

const BottomSearchBar: React.FC<BottomSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onCreateContent,
  onLocationSelect,
  onSearchMarkers,
  markers = [],
  userLocation,
  onFlyTo,
  searchRadius = 50 // default 50km radius
}) => {
  const searchInputRef = useRef<any>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    query: searchQuery,
    radius: searchRadius,
    results: []
  });
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Separate handling of user input and search
  const handleInputChange = (text: string) => {
    setSearchQuery(text); // Update parent state
    setSearchState(prev => ({ ...prev, query: text }));
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    if (text.length > 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(text, searchState.radius);
      }, 1000); // Increased delay to reduce API calls
    } else {
      setSearchState(prev => ({ ...prev, results: [] }));
      setShowResults(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 2) {
        performSearch(searchQuery, searchState.radius);
      } else {
        setSearchState(prev => ({ ...prev, results: [] }));
        setShowResults(false);
      }
    }, 500); // Increased delay to 500ms to be nice to Nominatim

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Updated search function with radius
  const performSearch = async (query: string, radius: number) => {
    if (!userLocation) return;
    
    setIsSearching(true);
    try {
      // Search local markers first
      const matchingMarkers = markers
        .filter(marker => {
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            marker.latitude,
            marker.longitude
          );
          return (
            distance <= radius &&
            (marker.title.toLowerCase().includes(query.toLowerCase()) ||
             marker.description.toLowerCase().includes(query.toLowerCase()))
          );
        })
        .map(marker => ({
          ...marker,
          type: "marker" as const
        }));
  
      // Use the utility function for location search
      const searchOptions: SearchOptions = {
        radius,
        limit: 10,
        userLocation
      };
      
      const locationResults = await performLocationSearch(query, searchOptions);
  
      setSearchState(prev => ({
        ...prev,
        results: [...matchingMarkers, ...locationResults]
      }));
      setShowResults(true);
  
      if (onSearchMarkers) {
        onSearchMarkers(query);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchState(prev => ({ ...prev, results: [] }));
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selection of a search result
  const handleSelectResult = (result: LocationSearchResult) => {
    setShowResults(false);
    setSearchState(prev => ({ ...prev, results: [] }));
    Keyboard.dismiss();
  
    if (onLocationSelect) {
      let distanceText = '';
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          result.latitude,
          result.longitude
        );
        distanceText = `${distance.toFixed(1)} km away`;
      }
  
      setSearchQuery(result.title);
      onLocationSelect({
        latitude: result.latitude,
        longitude: result.longitude,
        description: `${result.title}${distanceText ? ` (${distanceText})` : ''}`
      });
  
      if (onFlyTo) {
        onFlyTo({
          latitude: result.latitude,
          longitude: result.longitude,
          zoom: 18
        });
      }
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchState(prev => ({ ...prev, results: [] }));
    setShowResults(false);
    Keyboard.dismiss();
  };

  // Updated render section to use searchState
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
            onChangeText={handleInputChange}
            style={styles.searchInput}
            textColor="#FFFFFF"
            accessibilityLabel="Search"
            accessibilityHint="Search for locations and events near you"
            onSubmitEditing={() => performSearch(searchQuery, searchState.radius)}
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
      {showResults && searchState.results.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={searchState.results}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }: { item: LocationSearchResult }) => {
              let distanceText = '';
              if (userLocation) {
                const distance = calculateDistance(
                  userLocation.latitude,
                  userLocation.longitude,
                  item.latitude,
                  item.longitude
                );
                distanceText = `${distance.toFixed(1)} km away`;
              }

              return (
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
                      {distanceText ? ` • ${distanceText}` : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          {searchState.results.length === 10 && (
            <TouchableOpacity 
              style={styles.expandRadiusButton}
              onPress={() => {
                setSearchState(prev => ({
                  ...prev,
                  radius: prev.radius + 50
                }));
                performSearch(searchState.query, searchState.radius + 50);
              }}
            >
              <Text style={styles.expandRadiusText}>
                Search in a larger area
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {/* No Results Message */}
      {showResults && searchState.results.length === 0 && !isSearching && searchQuery.length > 2 && (
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
    color: "#FFFFFF",
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
  },
  expandRadiusButton: {
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  expandRadiusText: {
    color: '#3498DB',
    fontSize: 14,
  },
});

export default memo(BottomSearchBar);
