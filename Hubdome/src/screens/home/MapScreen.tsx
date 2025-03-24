// src/screens/home/MapScreen.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  AccessibilityInfo,
  Alert,
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
import BottomNavigation from "../../components/navigations/BottomNavigation";

// Hooks
import { useLocation } from "../../hooks/useLocation";

// Types & Constants
import { MapMarker, MapStyleType, MAP_STYLE_URLS } from "../../types/map";

const { width, height } = Dimensions.get("window");

const MapScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // Refs
  const bannerFadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // Get location data with custom hook
  const {
    location,
    permissionStatus,
    isLoading,
    errorMsg,
    requestLocation,
  } = useLocation();

  // State
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(true);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('map');
  const [mapStyle, setMapStyle] = useState<MapStyleType>('standard');

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
  
  // Fetch markers from API
  const fetchMarkers = useCallback(async () => {
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
      ];
      
      setMarkers(mockMarkers);
    } catch (error) {
      console.error('Error fetching markers:', error);
      Alert.alert(
        'Error',
        'Failed to load events around you. Please try again.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
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

  // Handler: When a marker is pressed, set it as selected
  const handleMarkerPress = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
  }, []);

  const isMountedRef = React.useRef(true); //created this to handle the unmounted event handlers

  useEffect(() => {
    return () => {
      isMountedRef.current = false; 
    }
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
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        title: eventData.title,
        description: eventData.description,
        type: 'event',
        subType: 'thread',
        createdAt: new Date().toISOString(),
        createdBy: 'CurrentUser',
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      setIsCreateModalOpen(false);
      Alert.alert(
        'Success',
        'Your event has been created and is now visible on the map!',
        [{ text: 'OK' }]
      );
    }
  }, [location]);

  // Default view state if location is not available
  const initialViewState = useMemo(() => ({
    longitude: location ? location.coords.longitude : -74.005974,
    latitude: location ? location.coords.latitude : 40.712776,
    zoom: 14,
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
      <View style={styles.mapContainer}>
        <MapViewComponent
          initialViewState={initialViewState}
          markers={markers}
          userLocation={userLocationForMap}
          mapStyle={MAP_STYLE_URLS[mapStyle]}
          onMarkerPress={handleMarkerPress}
          selectedMarker={selectedMarker}
        />
      </View>
      
      {/* Top Controls */}
      <TopRightControls
        onProfilePress={() => setIsProfileOpen(true)}
        onNotificationsPress={() => setIsNotificationOpen(true)}
      />

      {/* Map style toggle button */}
      <TouchableOpacity
        style={styles.mapStyleButton}
        onPress={handleMapStyleChange}
        accessibilityLabel="Change map style"
      >
        <MaterialIcons name="layers" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'map') {
            navigation.navigate(tab.charAt(0).toUpperCase() + tab.slice(1));
          }
        }}
      />

      {/* Modals and Sidebars */}
      <CreateEventModal
        isVisible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleEventCreated}
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
  mapStyleButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : 120,
    right: 20,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});

export default MapScreen;