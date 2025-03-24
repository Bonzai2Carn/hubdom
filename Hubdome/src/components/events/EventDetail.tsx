// src/screens/events/EventDetailScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Text,
  Appbar,
  Button,
  Card,
  Divider,
  Chip,
  List,
  Surface,
  Title,
  Avatar,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import eventService from "../../services/eventService";
import { formatDate } from "../../utils/dateUtils";
import { RootStackParamList } from "../../../app/types";

const { getEvent, joinEvent, leaveEvent } = eventService;

type ScreenNavigationProp = StackNavigationProp<ParamListBase>;

interface ScreenProps {
  route: RouteProp<{ params: { eventId: string } }, "params">;
  navigation: ScreenNavigationProp;
}

type EventDetailScreenRouteProp = RouteProp<RootStackParamList, "EventDetail">;
type EventDetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EventDetail"
>;

interface EventDetailScreenProps {
  route: EventDetailScreenRouteProp;
  navigation: EventDetailScreenNavigationProp;
}

const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [isAttending, setIsAttending] = useState(false);

  const currentUser = useAppSelector((state) => state.user.userInfo);

  // Custom brand colors
  const colors = {
    primary: "#3498DB", // Vibrant Blue
    accent: "#FF7F50", // Energetic Coral
    background: "#1E1E2A", // Dark background
    surface: "#2A2A36", // Slightly lighter surface
    text: "#FFFFFF", // White text
    textSecondary: "rgba(255,255,255,0.7)",
    border: "rgba(255,255,255,0.1)", // Added border color
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const responseData = await getEvent(eventId);
        setEvent(responseData); //it included .data.data - maybe it is to get it directly

        // Check if current user is attending
        if (responseData.participants && currentUser) {
          const isUserAttending = responseData.participants.some(
            (participant: any) => participant.id === currentUser.id
          );
          setIsAttending(isUserAttending);
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        Alert.alert("Error", "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, currentUser]);

  const handleJoinEvent = async () => {
    if (!currentUser) {
      Alert.alert(
        "Login Required",
        "You need to be logged in to join this event",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", 
            onPress: () => navigation.navigate("Auth") },
        ]
      );
      return;
    }

    try {
      setJoining(true);
      await joinEvent(eventId);
      setIsAttending(true);

      // Refresh event details to get updated participants list
      const response = await getEvent(eventId);
      setEvent(response);//.data.data

      Alert.alert("Success", "You've joined this event!");
    } catch (error) {
      console.error("Error joining event:", error);
      Alert.alert("Error", "Failed to join the event");
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    try {
      setLeaving(true);
      await leaveEvent(eventId);
      setIsAttending(false);

      // Refresh event details to get updated participants list
      const response = await getEvent(eventId);
      setEvent(response); //.data.data

      Alert.alert("Success", "You've left this event");
    } catch (error) {
      console.error("Error leaving event:", error);
      Alert.alert("Error", "Failed to leave the event");
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header style={{ backgroundColor: colors.surface }}>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color={colors.text}
          />
          <Appbar.Content title="Event Details" color={colors.text} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ color: colors.text, marginTop: 16 }}>
            Loading event details...
          </Text>
        </View>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Appbar.Header style={{ backgroundColor: colors.surface }}>
          <Appbar.BackAction
            onPress={() => navigation.goBack()}
            color={colors.text}
          />
          <Appbar.Content title="Event Details" color={colors.text} />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <MaterialIcons
            name="error-outline"
            size={48}
            color={colors.textSecondary}
          />
          <Text style={{ color: colors.text, marginTop: 16 }}>
            Event not found
          </Text>
          <Button
            mode="contained"
            style={{ marginTop: 20 }}
            onPress={() => navigation.goBack()}
          >
            Go Back
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header style={{ backgroundColor: colors.surface }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={colors.text}
        />
        <Appbar.Content title="Event Details" color={colors.text} />
        <Appbar.Action icon="share" color={colors.text} onPress={() => {}} />
      </Appbar.Header>

      <ScrollView>
        {/* Event Header with Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: event.image || "https://via.placeholder.com/400x200",
            }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.eventTypeContainer}>
            <Chip
              style={{ backgroundColor: colors.accent }}
              textStyle={{ color: colors.text }}
            >
              {event.hobby.name}
            </Chip>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {event.title}
          </Text>

          <View style={styles.organizerContainer}>
            <Avatar.Text
              size={36}
              label={event.organizer.name.charAt(0)}
              style={{ backgroundColor: colors.primary }}
            />
            <View style={styles.organizerInfo}>
              <Text style={{ color: colors.textSecondary }}>Organized by</Text>
              <Text style={{ color: colors.text, fontWeight: "bold" }}>
                {event.organizer.name}
              </Text>
            </View>
          </View>

          <Divider
            style={{ backgroundColor: colors.border, marginVertical: 16 }}
          />

          {/* Date, Time, Location */}
          <View style={styles.infoRow}>
            <MaterialIcons
              name="event"
              size={24}
              color={colors.textSecondary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Date & Time
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {formatDate(event.startDate)}
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {formatDate(event.endDate, true)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons
              name="location-on"
              size={24}
              color={colors.textSecondary}
            />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Location
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {event.location.formattedAddress}
              </Text>
              <TouchableOpacity style={styles.directionsButton}>
                <Text style={{ color: colors.primary }}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Map View */}
          {/* <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: event.location.coordinates[1],
                longitude: event.location.coordinates[0],
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              customMapStyle={[
                {
                  elementType: "geometry",
                  stylers: [{ color: "#242f3e" }],
                },
                {
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#746855" }],
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#17263c" }],
                },
              ]}
            >
              <Marker
                coordinate={{
                  latitude: event.location.coordinates[1],
                  longitude: event.location.coordinates[0],
                }}
                title={event.title}
              />
            </MapView>
          </View> */}

          <Divider
            style={{ backgroundColor: colors.border, marginVertical: 16 }}
          />

          {/* Event Description */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {event.description}
          </Text>

          <Divider
            style={{ backgroundColor: colors.border, marginVertical: 16 }}
          />

          {/* Attendees */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Attendees ({event.participants.length}/{event.capacity})
          </Text>
          <View style={styles.attendeesContainer}>
            {event.participants.slice(0, 5).map((participant: any) => (
              <Avatar.Text
                key={participant.id}
                size={40}
                label={participant.name.charAt(0)}
                style={{ margin: 4, backgroundColor: colors.primary }}
              />
            ))}
            {event.participants.length > 5 && (
              <Avatar.Text
                size={40}
                label={`+${event.participants.length - 5}`}
                style={{ margin: 4, backgroundColor: colors.surface }}
                labelStyle={{ color: colors.text }}
              />
            )}
          </View>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        {isAttending ? (
          <Button
            mode="outlined"
            style={[styles.actionButton, { borderColor: colors.accent }]}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: colors.accent }}
            onPress={handleLeaveEvent}
            loading={leaving}
            disabled={leaving}
          >
            Leave Event
          </Button>
        ) : (
          <Button
            mode="contained"
            style={[styles.actionButton, { backgroundColor: colors.accent }]}
            contentStyle={{ height: 50 }}
            onPress={handleJoinEvent}
            loading={joining}
            disabled={joining || event.participants.length >= event.capacity}
          >
            {event.participants.length >= event.capacity
              ? "Event Full"
              : "Join Event"}
          </Button>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 200,
  },
  eventTypeContainer: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  detailsContainer: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  organizerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  organizerInfo: {
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    marginBottom: 4,
  },
  infoValue: {
    fontWeight: "500",
  },
  directionsButton: {
    marginTop: 4,
  },
  mapContainer: {
    height: 150,
    marginTop: 16,
    borderRadius: 8,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  attendeesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  actionButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  actionButton: {
    borderRadius: 8,
  },
});

export default EventDetailScreen;