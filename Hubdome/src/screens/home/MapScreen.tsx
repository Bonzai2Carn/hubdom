// src/screens/home/MapScreen.tsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  AccessibilityInfo,
  Alert,
  PanResponder,
  GestureResponderEvent 
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';

// Components
import MapViewComponent from "../../components/maps/MapViewComponent";
import CreateEventModal from "../../components/events/CreateEventModal";
import ProfileSidebar from "../../components/maps/ProfileSidebar";
import NotificationSidebar from "../../components/maps/NotificationSidebar";
import MarkerDetailPopup from "../../components/maps/MarkerDetailPopup";
import TopRightControls from "../../components/maps/TopRightControls";
import AnnouncementBanner from "../../components/common/AnnouncementBanner";
import BottomSearchBar from "../../components/maps/BottomSearchBar";


// Hooks
import { useLocation } from "../../hooks/useLocation";
import { useMapMarkers } from "@/src/hooks/useMapMarkers";

// Types & Constants
import { MapMarker, MapStyleType, MAP_STYLE_URLS} from "../../types/map";
import type { MapViewComponentRef } from "../../components/maps/MapViewComponent";
import QuickAccessToolbar, { ToolbarItem } from '../../components/maps/QuickAccessToolbar';


const MapScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Refs
  const bannerFadeAnim = React.useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapViewComponentRef>(null);

  // State
  const [state, setState] = useState<MapScreenState>({
    isCreateModalOpen: false,
    isProfileOpen: false,
    isNotificationOpen: false,
    searchQuery: '',
    isBannerVisible: true,
    isScreenReaderEnabled: false,
    mapStyle: 'standard',
    isSearching: false,
    longPressCoordinates: null
  });
  
  // Get location data with custom hook
  const {
    location,
    permissionStatus,
    isLoading,
    errorMsg,
    requestLocation,
  } = useLocation();

  const {
    filteredMarkers,
    selectedMarker,
    isLoading: markersLoading,
    error: markersError,
    selectMarker,
    addMarker,
    refreshMarkers,
    searchMarkers
  } = useMapMarkers({ 
    searchQuery: state.searchQuery,
    userLocation: location?.coords
  });

  // State
  // const [markers, setMarkers] = useState<MapMarker[]>([]);
  // const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  // const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  // const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  // const [searchQuery, setSearchQuery] = useState<string>('');
  // const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);
  // const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState<boolean>(false);
  // const [activeTab, setActiveTab] = useState<string>('map');
  // const [mapStyle, setMapStyle] = useState<MapStyleType>('standard');
  // const [filteredMarkers, setFilteredMarkers] = useState<MapMarker[]>([]);
  // const [isSearching, setIsSearching] = useState<boolean>(false);
  // state for long press gesture

  const [longPressCoordinates, setLongPressCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Check for screen reader
  useEffect(() => {
    const checkScreenReader = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(isEnabled);
    };
    
    checkScreenReader();
    
    // Listen for screen reader changes
    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled
    );
    
    return () => {
      subscription.remove();
    };
  }, []);

  // Long press to add marker
  const handleMapLongPress = useCallback((coordinates: {
    latitude: number;
    longitude: number;
  }) => {
    // Store the coordinates
    setLongPressCoordinates(coordinates);
    // Open the create event modal
    setIsCreateModalOpen(true);
  }, []);
  
  // Fetch markers from API
  const fetchMarkers = useCallback(async () => {
    setIsSearching(true);
    try {
      // In a real app, this would be an API call
      // For now, using mock data
      const mockMarkers: MapMarker[] = [
        {
          id: "1",
          latitude: location ? location.coords.latitude + 0.001 : 40.712776,
          longitude: location ? location.coords.longitude + 0.001 : -74.005974,
          title: "Photography Meetup",
          description: "Join us for a photography session in the park",
          type: "event",
          subType: "video",
          createdAt: new Date().toISOString(),
          createdBy: "User123",
        },
        {
          id: "2",
          latitude: location ? location.coords.latitude - 0.002 : 40.713776,
          longitude: location ? location.coords.longitude - 0.001 : -74.004974,
          title: "Coffee Tasting",
          description: "Explore different coffee flavors and brewing techniques",
          type: "event",
          subType: "thread",
          createdAt: new Date().toISOString(),
          createdBy: "User456",
        },
        {
          id: "3",
          latitude: location ? location.coords.latitude + 0.002 : 40.711776, 
          longitude: location ? location.coords.longitude + 0.002 : -74.003974,
          title: "Music Jam Session",
          description: "Bring your instruments for an outdoor jam session",
          type: "event",
          subType: "audio",
          createdAt: new Date().toISOString(),
          createdBy: "User789",
        },
        {
          id: "4",
          latitude: location ? location.coords.latitude - 0.001 : 40.710776,
          longitude: location ? location.coords.longitude + 0.003 : -74.002974,
          title: "Hiking Group",
          description: "Weekly hiking group for all experience levels",
          type: "event",
          subType: "thread",
          createdAt: new Date().toISOString(),
          createdBy: "User101",
        },
        {
          id: "5",
          latitude: location ? location.coords.latitude + 0.003 : 40.714776,
          longitude: location ? location.coords.longitude - 0.002 : -74.001974,
          title: "Book Club Meeting",
          description: "Discussing 'The Great Gatsby' this week",
          type: "event",
          subType: "thread",
          createdAt: new Date().toISOString(),
          createdBy: "User202",
        },
      ];
      
      setMarkers(mockMarkers);
      setFilteredMarkers(mockMarkers);
    } catch (error) {
      console.error('Error fetching markers:', error);
      Alert.alert(
        'Error',
        'Failed to load events around you. Please try again.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
    } finally {
      setIsSearching(false);
    }
  }, [location]);

  // Load markers when focused
  useFocusEffect(
    useCallback(() => {
      fetchMarkers();
      
      // Animate banner in
      Animated.timing(bannerFadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      const bannerTimer = setTimeout(() => {
        Animated.timing(bannerFadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setIsBannerVisible(false));
      }, 5000);
      
      return () => {
        clearTimeout(bannerTimer);
      };
    }, [fetchMarkers, bannerFadeAnim])
  );

  // Filter markers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMarkers(markers);
      return;
    }
    
    const filtered = markers.filter(marker => 
      marker.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      marker.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredMarkers(filtered);
  }, [markers, searchQuery]);

  // Handler: When a marker is pressed, set it as selected
  const handleMarkerPress = useCallback((marker: MapMarker) => {
  selectMarker(marker);
}, [selectMarker]);


  // Handler: When location from search is selected
  const handleLocationSelect = useCallback((locationData: {
    latitude: number;
    longitude: number;
    description: string;
  }) => {
    // Navigate map to the selected location
    if (mapRef.current) {
      // This would call a method on the MapViewComponent to fly to the location
      // For now, we'll just log it
      console.log('Flying to location:', locationData);
      
      // Clear search query after selection
      setSearchQuery('');
    }
  }, []);

  // Handler: When search is performed on markers
  const handleSearchMarkers = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handler: When create content button is pressed
  const handleCreateContentPress = useCallback((type: "photo" | "audio" | "thread") => {
    switch (type) {
      case "photo":
        navigation.navigate("Camera");
        break;
      case "audio":
        navigation.navigate("Audio");
        break;
      case "thread":
        setIsCreateModalOpen(true);
        break;
    }
  }, [navigation]);

  // Handler: Cycle through map styles
  const handleMapStyleChange = useCallback(() => {
    setMapStyle((currentStyle) => {
      switch (currentStyle) {
        case 'standard':
          return 'satellite';
        case 'satellite':
          return 'terrain';
        case 'terrain':
          return 'standard';
      }
    });
  }, []);

  // Handle event creation (adds a new marker)
  const handleEventCreated = useCallback((eventData: any) => {
    if (location) {
      const newMarker: MapMarker = {
        id: Date.now().toString(),
        latitude: eventData.location.coordinates[1],
        longitude: eventData.location.coordinates[0],
        title: eventData.title,
        description: eventData.description,
        type: 'event',
        subType: 'thread',
        createdAt: eventData.startDate || new Date().toISOString(),
        createdBy: 'CurrentUser',
        imageUrl: eventData.imageUrl || eventData.media?.uri || eventData.media?.thumbnail, // Add the image URL from the event data
      };
      
      addMarker(newMarker);

      setIsCreateModalOpen(false);
      
      // Alert success
      Alert.alert(
        'Success',
        'Your event has been created and is now visible on the map!',
        [{ text: 'OK' }]
      );
    }
  }, [location]);

  // Configure pan responder for map rotation
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => evt.nativeEvent.touches.length === 2,
      onPanResponderMove: (evt: GestureResponderEvent) => {
        if (evt.nativeEvent.touches.length === 2) {
          const [touch1, touch2] = evt.nativeEvent.touches;
          
          // Calculate angle between touches
          const angle = Math.atan2(
            touch2.pageY - touch1.pageY,
            touch2.pageX - touch1.pageX
          ) * (180 / Math.PI);

          // Update map bearing if map reference exists
          mapRef.current?.rotateTo?.(angle);
        }
      }
    })
  ).current;

  // Default view state if location is not available
  const initialViewState = useMemo(() => ({
    longitude: location ? location.coords.longitude : -74.005974,
    latitude: location ? location.coords.latitude : 40.712776,
    zoom: 18,
    pitch: 60,
    bearing: 15
  }), [location]);

  // User location for the map
  const userLocationForMap = useMemo(() => {
    if (!location) return undefined;
    return {
      longitude: location.coords.longitude,
      latitude: location.coords.latitude
    };
  }, [location]);

  // Loading screen while location is being determined
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>
          {permissionStatus !== 'granted'
            ? 'Location permission is required for a better experience'
            : 'Getting your location...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2A" />
      
      {/* Map View */}
      <View style={styles.mapContainer} {...panResponder.panHandlers}>
        <MapViewComponent
          ref={mapRef}
          initialViewState={initialViewState}
          markers={filteredMarkers}
          userLocation={userLocationForMap}
          mapStyle={MAP_STYLE_URLS[mapStyle]}
          onMarkerPress={handleMarkerPress}
          selectedMarker={selectedMarker}
          onStyleChange={handleMapStyleChange}
          onLongPress={handleMapLongPress}

        />
      </View>
      
      {/* Top Controls */}
      <TopRightControls
        onProfilePress={() => setIsProfileOpen(true)}
        onNotificationsPress={() => setIsNotificationOpen(true)}
      />

      {/* Banner (for announcements) */}
      {isBannerVisible && (
        <AnnouncementBanner
          fadeAnim={bannerFadeAnim}
          message="New feature: Create events and share them with nearby users!"
          onClose={() => setIsBannerVisible(false)}
        />
      )}

      {/* Selected Marker Popup */}
      {selectedMarker && (
        <MarkerDetailPopup
          marker={selectedMarker}
          onClose={() => setSelectedMarker(null)}
          onJoin={() => {
            console.log("Joining event:", selectedMarker.id);
            Alert.alert("Success", "You have joined this event!");
            setSelectedMarker(null);
          }}
          onViewDetails={() => {
            navigation.navigate("EventDetail", { eventId: selectedMarker.id });
            setSelectedMarker(null);
          }}
        />
      )}

      {/* Bottom Search and Create Bar */}
      <BottomSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreateContent={handleCreateContentPress}
        onLocationSelect={handleLocationSelect}
        onSearchMarkers={handleSearchMarkers}
        markers={markers}
        userLocation={userLocationForMap}
        onFlyTo={(location) => {
          if (mapRef.current) {
            mapRef.current.flyTo({
              longitude: location.longitude,
              latitude: location.latitude,
              zoom: location.zoom || initialViewState.zoom
            });
          }
        }}
      />

      {/* Modals and Sidebars */}
      <CreateEventModal
        isVisible={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false),
          setLongPressCoordinates(null);
        }}
        onSubmit={handleEventCreated}
        initialLocation={longPressCoordinates} // Pass coordinates to modal
      />
      <ProfileSidebar
        isVisible={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        navigation={navigation}
      />
      <NotificationSidebar
        isVisible={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2A",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapScreen;