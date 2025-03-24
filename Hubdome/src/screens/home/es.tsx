import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import {
  Surface,
  Text,
  Appbar,
  Searchbar,
  Chip,
  Card,
  Button,
  Divider,
  FAB,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";

type ScreenNavigationProp = StackNavigationProp<ParamListBase>;

interface ScreenProps {
  navigation: ScreenNavigationProp;
}

// Define interfaces for event types
interface EventType {
  id: string;
  name: string;
  color: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  eventType: string;
  attendees: number;
  isUserAttending: boolean;
}

const EventsScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  // Custom theme colors based on our brand identity
  const colors = {
    primary: "#3498DB", // Vibrant Blue
    accent: "#FF7F50", // Energetic Coral
    background: "#1E1E2A", // Dark background
    surface: "#2A2A36", // Slightly lighter surface
    text: "#FFFFFF", // White text
    textSecondary: "rgba(255,255,255,0.7)",
  };

  // Mock event types for filtering
  const eventTypes: EventType[] = [
    { id: "1", name: "Photography", color: "#F97316" },
    { id: "2", name: "Hiking", color: "#3B82F6" },
    { id: "3", name: "Cooking", color: "#EF4444" },
    { id: "4", name: "Gaming", color: "#8B5CF6" },
    { id: "5", name: "Music", color: "#EC4899" },
  ];

  // Mock events data
  const events: Event[] = [
    {
      id: "1",
      title: "Photography Workshop",
      description:
        "Learn the basics of photography with professional photographers",
      date: "2025-03-15T14:00:00Z",
      location: "San Francisco, CA",
      imageUrl: "https://via.placeholder.com/300x150",
      eventType: "Photography",
      attendees: 24,
      isUserAttending: true,
    },
    {
      id: "2",
      title: "Mountain Hiking Trip",
      description: "Join us for a thrilling hiking adventure in the mountains",
      date: "2025-03-20T09:00:00Z",
      location: "Yosemite National Park",
      imageUrl: "https://via.placeholder.com/300x150",
      eventType: "Hiking",
      attendees: 15,
      isUserAttending: false,
    },
    {
      id: "3",
      title: "Italian Cooking Class",
      description: "Learn to make authentic Italian pasta from scratch",
      date: "2025-03-22T18:00:00Z",
      location: "Downtown Cooking Studio",
      imageUrl: "https://via.placeholder.com/300x150",
      eventType: "Cooking",
      attendees: 10,
      isUserAttending: true,
    },
    {
      id: "4",
      title: "Gaming Tournament",
      description:
        "Compete in our monthly gaming tournament with other enthusiasts",
      date: "2025-03-25T17:00:00Z",
      location: "GameHub Center",
      imageUrl: "https://via.placeholder.com/300x150",
      eventType: "Gaming",
      attendees: 32,
      isUserAttending: false,
    },
    {
      id: "5",
      title: "Live Music Jam Session",
      description: "Bring your instrument and join our open jam session",
      date: "2025-03-28T20:00:00Z",
      location: "Melody Bar",
      imageUrl: "https://via.placeholder.com/300x150",
      eventType: "Music",
      attendees: 18,
      isUserAttending: false,
    },
  ];

  // Filter events based on search query and selected event type
  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchQuery
      ? event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesType = selectedEventType
      ? event.eventType === selectedEventType
      : true;

    return matchesSearch && matchesType;
  });

  // Format date string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get color for event type
  const getEventTypeColor = (eventType: string): string => {
    const type = eventTypes.find((t) => t.name === eventType);
    return type ? type.color : colors.primary;
  };

  // Toggle attendance for an event
  const toggleAttendance = (eventId: string) => {
    // This would update the state or call an API in a real application
    console.log(`Toggling attendance for event ${eventId}`);
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <Card
      style={styles.eventCard}
      onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
    >
      <Card.Cover source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <View
        style={[
          styles.eventTypeIndicator,
          { backgroundColor: getEventTypeColor(item.eventType) },
        ]}
      />

      <Card.Content style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Chip
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            textStyle={{ color: colors.textSecondary, fontSize: 12 }}
          >
            {item.eventType}
          </Chip>
        </View>

        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.eventMetadata}>
          <View style={styles.eventMetadataItem}>
            <MaterialIcons
              name="event"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.eventMetadataText}>
              {formatDate(item.date)}
            </Text>
          </View>

          <View style={styles.eventMetadataItem}>
            <MaterialIcons
              name="location-on"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.eventMetadataText}>{item.location}</Text>
          </View>

          <View style={styles.eventMetadataItem}>
            <MaterialIcons
              name="people"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={styles.eventMetadataText}>
              {item.attendees} attendees
            </Text>
          </View>
        </View>
      </Card.Content>

      <Divider
        style={{ backgroundColor: "rgba(255,255,255,0.1)", marginVertical: 8 }}
      />

      <Card.Actions>
        <Button
          mode={item.isUserAttending ? "contained" : "outlined"}
          onPress={() => toggleAttendance(item.id)}
          style={{
            flex: 1,
            backgroundColor: item.isUserAttending
              ? colors.accent
              : "transparent",
            borderColor: colors.accent,
          }}
          textColor={item.isUserAttending ? "white" : colors.accent}
        >
          {item.isUserAttending ? "Attending" : "Attend"}
        </Button>

        <Button
          mode="text"
          onPress={() =>
            navigation.navigate("EventDetail", { eventId: item.id })
          }
          textColor={colors.primary}
        >
          Details
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.Content title="Upcoming Events" color={colors.text} />
        <Appbar.Action icon="filter" color={colors.text} onPress={() => {}} />
        <Appbar.Action icon="sort" color={colors.text} onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search events"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          iconColor={colors.primary}
          placeholderTextColor="rgba(255,255,255,0.5)"
          inputStyle={{ color: colors.text }}
          theme={{ colors: { surface: colors.surface } }}
        />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          <Chip
            selected={selectedEventType === null}
            onPress={() => setSelectedEventType(null)}
            style={[
              styles.filterChip,
              selectedEventType === null && { backgroundColor: colors.primary },
            ]}
            textStyle={{
              color:
                selectedEventType === null ? "white" : colors.textSecondary,
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
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 12 }}>
            Loading events...
          </Text>
        </View>
      ) : filteredEvents.length > 0 ? (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialIcons
            name="event-busy"
            size={64}
            color="rgba(255,255,255,0.2)"
          />
          <Text style={styles.emptyText}>No events found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? "Try a different search term or filter"
              : "Join or create an event to get started"}
          </Text>

          <Button
            mode="contained"
            onPress={() => {
              setSearchQuery("");
              setSelectedEventType(null);
            }}
            style={{ marginTop: 16, backgroundColor: colors.primary }}
          >
            Clear Filters
          </Button>
        </View>
      )}

      <FAB
        style={[styles.fab, { backgroundColor: colors.accent }]}
        icon="plus"
        onPress={() => navigation.navigate("CreateEvent")}
        color="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchBar: {
    backgroundColor: "rgba(255,255,255,0.07)",
    elevation: 0,
    borderRadius: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterScrollContent: {
    paddingRight: 32,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Extra padding at bottom for FAB
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 240,
  },
  eventCard: {
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  eventImage: {
    height: 150,
  },
  eventTypeIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 5,
    height: "100%",
  },
  eventContent: {
    paddingTop: 12,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    marginRight: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
  },
  eventMetadata: {
    marginBottom: 8,
  },
  eventMetadataItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eventMetadataText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 6,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default EventsScreen;
