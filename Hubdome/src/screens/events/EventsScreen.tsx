// src/screens/events/EventsScreen.tsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  ScrollView,
} from "react-native";
import { Appbar, FAB, Chip, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

// Import actions
import { 
  getUserEvents, 
  getAllEvents, 
  joinEvent, 
  leaveEvent 
} from "../../redux/actions/eventActions";

// Import components
import EventCard from "../../components/events/EventCard";
import EventSearchBar from "../../components/events/EventSearchBar";
import CreateEventModal from "../../components/events/CreateEventModal";
import AnalyticsCard from "../../components/events/AnalyticsCard";
import EmptyState from "./EmptyState";

// Tab types
type EventTab = "myEvents" | "joined" | "wishlist" | "analytics";

const EventsScreen = () => {
  // Navigation
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  // State
  const [activeTab, setActiveTab] = useState<EventTab>("myEvents");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  
  // Get events from redux store
  const { 
    events, 
    userEvents, 
    loading,
    error 
  } = useAppSelector((state) => state.event);
  
  // Mock wishlist events for now
  const [wishlistEvents, setWishlistEvents] = useState([]);
  
  // Colors
  const colors = {
    primary: "#3498DB", 
    accent: "#FF7F50", 
    background: "#1E1E2A", 
    surface: "#2A2A36", 
    text: "#FFFFFF", 
    textSecondary: "rgba(255,255,255,0.7)",
  };
  
  // Event types for filtering
  const eventTypes = [
    { id: "1", name: "Photography", color: "#F97316" },
    { id: "2", name: "Hiking", color: "#3B82F6" },
    { id: "3", name: "Cooking", color: "#EF4444" },
    { id: "4", name: "Gaming", color: "#8B5CF6" },
    { id: "5", name: "Music", color: "#EC4899" },
  ];
  
  // Load data when component mounts
  useEffect(() => {
    loadEvents();
  }, []);
  
  // Load events based on active tab
  const loadEvents = useCallback(async () => {
    try {
      if (activeTab === "myEvents" || activeTab === "joined") {
        await dispatch(getUserEvents());
      } else if (activeTab === "wishlist") {
        // In future: implement wishlist events fetch
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }, [activeTab, dispatch]);
  
  // Create a new event
  const handleCreateEvent = useCallback((eventData) => {
    // Display success message
    console.log("Creating event with data:", eventData);
    // Close modal and refresh events
    setIsCreateModalVisible(false);
    loadEvents();
  }, [loadEvents]);
  
  // Toggle event attendance
  const handleToggleAttendance = useCallback((eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      if (event.isUserAttending) {
        dispatch(leaveEvent(eventId));
      } else {
        dispatch(joinEvent(eventId));
      }
    }
  }, [events, dispatch]);
  
  // View event details
  const handleViewEventDetails = useCallback((eventId) => {
    navigation.navigate("EventDetail", { eventId });
  }, [navigation]);
  
  // Clear search and filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedEventType(null);
  }, []);
  
  // Filter events based on search query and selected type
  const getFilteredEvents = useCallback(() => {
    let filteredList = [];
    
    // Select events based on active tab
    if (activeTab === "myEvents") {
      // Show events created by the user
      filteredList = userEvents.filter(event => event.isUserOrganizer);
    } else if (activeTab === "joined") {
      // Show events the user is attending but didn't create
      filteredList = userEvents.filter(event => 
        event.isUserAttending && !event.isUserOrganizer
      );
    } else if (activeTab === "wishlist") {
      // Show wishlist events
      filteredList = wishlistEvents;
    }
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filteredList = filteredList.filter(event =>
        event.title.toLowerCase().includes(lowerCaseQuery) ||
        event.description.toLowerCase().includes(lowerCaseQuery) ||
        event.location.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply event type filter
    if (selectedEventType) {
      filteredList = filteredList.filter(event => 
        event.eventType === selectedEventType
      );
    }
    
    return filteredList;
  }, [
    activeTab, 
    userEvents, 
    wishlistEvents, 
    searchQuery, 
    selectedEventType
  ], []);
  
  // Render analytics tab content
  const renderAnalyticsTab = () => {
    // Sample analytics data - in a real app, calculate from real events
    const analyticsData = {
      totalEventsCreated: userEvents.filter(e => e.isUserOrganizer).length,
      totalEventsJoined: userEvents.filter(e => e.isUserAttending && !e.isUserOrganizer).length,
      mostActiveCategory: "Photography",
      upcomingEvents: userEvents.filter(e => new Date(e.date) > new Date()).length,
      participationRate: 78, // Percentage
      averageAttendees: 12,
    };
    
    return (
      <View style={styles.analyticsContainer}>
        <Text style={styles.analyticsTitle}>Your Event Participation</Text>
        
        <View style={styles.analyticsRow}>
          <AnalyticsCard 
            title="Created"
            value={analyticsData.totalEventsCreated.toString()}
            icon="add-circle"
            color="#3498DB"
          />
          <AnalyticsCard 
            title="Joined"
            value={analyticsData.totalEventsJoined.toString()}
            icon="groups"
            color="#FF7F50"
          />
        </View>
        
        <View style={styles.analyticsRow}>
          <AnalyticsCard 
            title="Upcoming"
            value={analyticsData.upcomingEvents.toString()}
            icon="event"
            color="#2ECC71"
          />
          <AnalyticsCard 
            title="Avg. Attendees"
            value={analyticsData.averageAttendees.toString()}
            icon="people"
            color="#9B59B6"
          />
        </View>
        
        <View style={styles.participationCard}>
          <Text style={styles.participationTitle}>Participation Rate</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${analyticsData.participationRate}%` }
              ]}
            />
          </View>
          <Text style={styles.participationText}>
            {analyticsData.participationRate}% of events you RSVP'd to
          </Text>
        </View>
        
        <View style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>Most Active Category</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {analyticsData.mostActiveCategory}
            </Text>
          </View>
          <Text style={styles.categorySubtext}>
            You're most active in this category
          </Text>
        </View>
      </View>
    );
  };
  
  // Determine which content to show based on active tab
  const renderTabContent = () => {
    if (activeTab === "analytics") {
      return renderAnalyticsTab();
    }
    
    // Get filtered events for the current tab
    const filteredEvents = getFilteredEvents();
    
    // Show loading indicator if loading
    if (loading) {
      return (
        <View style={styles.centeredContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 16 }}>
            Loading events...
          </Text>
        </View>
      );
    }
    
    // Show error message if there's an error
    if (error) {
      return (
        <View style={styles.centeredContent}>
          <MaterialIcons name="error" size={48} color="#E74C3C" />
          <Text style={{ color: colors.text, marginTop: 16 }}>
            Error loading events. Please try again.
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadEvents}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    // Show events list or empty state
    return (
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <EventCard
            item={item}
            onToggleAttendance={handleToggleAttendance}
            onPress={handleViewEventDetails}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          filteredEvents.length === 0
            ? styles.centeredListContent
            : styles.listContent
        }
        ListEmptyComponent={
          <EmptyState
            searchQuery={searchQuery}
            selectedEventType={selectedEventType}
            onClearFilters={handleClearFilters}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.Content title="Events" color={colors.text} />
        {activeTab !== "analytics" && (
          <>
            <Appbar.Action 
              icon="filter" 
              color={colors.text} 
              onPress={() => {}} 
            />
            <Appbar.Action 
              icon="sort" 
              color={colors.text} 
              onPress={() => {}} 
            />
          </>
        )}
      </Appbar.Header>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "myEvents" && styles.activeTab]}
          onPress={() => setActiveTab("myEvents")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "myEvents" && styles.activeTabText,
            ]}
          >
            My Events
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "joined" && styles.activeTab]}
          onPress={() => setActiveTab("joined")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "joined" && styles.activeTabText,
            ]}
          >
            Joined
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "wishlist" && styles.activeTab]}
          onPress={() => setActiveTab("wishlist")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "wishlist" && styles.activeTabText,
            ]}
          >
            Wishlist
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "analytics" && styles.activeTab]}
          onPress={() => setActiveTab("analytics")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "analytics" && styles.activeTabText,
            ]}
          >
            Analytics
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Search Bar and Filters (not shown in Analytics tab) */}
      {activeTab !== "analytics" && (
        <>
          <View style={styles.searchContainer}>
            <EventSearchBar
              searchQuery={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            <Chip
              selected={selectedEventType === null}
              onPress={() => setSelectedEventType(null)}
              style={[
                styles.filterChip,
                selectedEventType === null && styles.selectedFilterChip,
              ]}
              textStyle={{
                color: selectedEventType === null ? "white" : colors.textSecondary,
              }}
            >
              All
            </Chip>
            
            {eventTypes.map((type) => (
              <Chip
                key={type.id}
                selected={selectedEventType === type.name}
                onPress={() => setSelectedEventType(type.name)}
                style={[
                  styles.filterChip,
                  selectedEventType === type.name && {
                    backgroundColor: type.color,
                  },
                ]}
                textStyle={{
                  color:
                    selectedEventType === type.name
                      ? "white"
                      : colors.textSecondary,
                }}
              >
                {type.name}
              </Chip>
            ))}
          </ScrollView>
          
          <Divider style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
        </>
      )}
      
      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>
      
      {/* Create Event FAB */}
      <FAB
        style={[styles.fab, { backgroundColor: colors.accent }]}
        icon="plus"
        onPress={() => setIsCreateModalVisible(true)}
        color="white"
      />
      
      {/* Create Event Modal */}
      <CreateEventModal
        isVisible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreateEvent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#2A2A36",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498DB",
  },
  tabText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  searchContainer: {
    padding: 16,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },
  selectedFilterChip: {
    backgroundColor: "#3498DB",
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  centeredListContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#3498DB",
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  // Analytics styles
  analyticsContainer: {
    padding: 16,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  analyticsRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  participationCard: {
    backgroundColor: "#2A2A36",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  participationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 6,
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: "#3498DB",
    borderRadius: 6,
  },
  participationText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  categoryCard: {
    backgroundColor: "#2A2A36",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: "#F97316",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  categoryText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  categorySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
});

export default EventsScreen;