// Event related types
export interface EventType {
  id: string;
  name: string;
  color: string;
}

export interface EventData {
  title: string;
  description: string;
  category: string;
  eventType: string;
  days: number[];
  time: string;
  participants: string[];
  hobbyId: string;          // Added missing properties
  startDate: string;
  endDate: string;
  location: {                             // Update location to match expected type
    coordinates: [number, number];
    formattedAddress: string;
  };
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  imageUrl: string;
  eventType: string;
  attendees: number;
  isUserAttending: boolean;
  media?: {
      uri: string;
  };
}

// Component props
export interface EventsScreenProps {
  navigation: any;
}

export interface EventCardProps {
  item: Event;
  onToggleAttendance: (eventId: string) => void;
  onPress: (eventId: string) => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
}

export interface FilterChipsProps {
  selectedEventType: string | null;
  eventTypes: EventType[];
  onSelectEventType: (typeId: string | null) => void;
}

export interface EmptyStateProps {
  searchQuery: string;
  selectedEventType: string | null;
  onClearFilters: () => void;
}

export interface EventListProps {
  loading: boolean;
  events: Event[];
  filteredEvents: Event[];
  searchQuery: string;
  selectedEventType: string | null;
  onToggleAttendance: (eventId: string) => void;
  onEventPress: (eventId: string) => void;
  onClearFilters: () => void;
}
