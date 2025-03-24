// mobile/src/components/cards/EventCard.tsx
import React, { memo, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Button, Card, Chip, Divider } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Event } from "../../types/events";

// Define EventCardProps properly with required properties
interface EventCardProps {
  item: Event;
  onToggleAttendance: (eventId: string) => void;
  onPress: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  item,
  onToggleAttendance,
  onPress,
}) => {
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
    switch (eventType) {
      case "Photography":
        return "#F97316";
      case "Hiking":
        return "#3B82F6";
      case "Cooking":
        return "#EF4444";
      case "Gaming":
        return "#8B5CF6";
      case "Music":
        return "#EC4899";
      default:
        return "#3498DB";
    }
  };

  const eventTypeColor = useMemo(
    () => getEventTypeColor(item.eventType),
    [item.eventType]
  );

  return (
    <Card style={styles.eventCard}>
      <Card.Cover source={{ uri: item.imageUrl }} style={styles.eventImage} />
      <View
        style={[styles.eventTypeIndicator, { backgroundColor: eventTypeColor }]}
      />

      <Card.Content style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Chip
            style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
            textStyle={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}
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
              color="rgba(255,255,255,0.7)"
            />
            <Text style={styles.eventMetadataText}>
              {formatDate(item.date)}
            </Text>
          </View>

          <View style={styles.eventMetadataItem}>
            <MaterialIcons
              name="location-on"
              size={16}
              color="rgba(255,255,255,0.7)"
            />
            <Text style={styles.eventMetadataText}>{item.location}</Text>
          </View>

          <View style={styles.eventMetadataItem}>
            <MaterialIcons
              name="people"
              size={16}
              color="rgba(255,255,255,0.7)"
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
          onPress={() => onToggleAttendance(item.id)}
          style={{
            flex: 1,
            backgroundColor: item.isUserAttending ? "#FF7F50" : "transparent",
            borderColor: "#FF7F50",
          }}
          textColor={item.isUserAttending ? "white" : "#FF7F50"}
        >
          {item.isUserAttending ? "Attending" : "Attend"}
        </Button>

        <Button
          mode="text"
          onPress={() => onPress(item.id)}
          textColor="#3498DB"
        >
          Details
        </Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  eventCard: {
    marginBottom: 16,
    backgroundColor: "#2A2A36",
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
});

export default memo(EventCard);