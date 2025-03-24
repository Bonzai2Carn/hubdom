import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
  Platform,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ContentItem } from '../../types/discover';
import { LocationService, LocationStatus } from '../../services/NearbyLocation';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Component props type
interface HappeningNearYouProps {
  onItemPress: (item: ContentItem) => void;
  onFork: (item: ContentItem) => void;
}

// Local item type with distance info
interface NearbyContentItem extends ContentItem {
  distance: number;
  distanceText: string;
}

const CARD_WIDTH = width * 0.8; // Card takes 80% of the screen width
const SPACING = width * 0.05; // 5% spacing between cards

const HappeningNearYou: React.FC<HappeningNearYouProps> = ({ onItemPress, onFork }) => {
  // State
  const [locationStatus, setLocationStatus] = useState<LocationStatus>({ status: 'loading' });
  const [nearbyContent, setNearbyContent] = useState<NearbyContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // References
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<NearbyContentItem>>(null);
  
  // Get location service singleton
  const locationService = LocationService.getInstance();
  
  // Load nearby content based on location
  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      const location = await locationService.getCurrentLocation();
      setLocationStatus(location);
      
      if (location.status === 'success' && location.coordinates) {
        // In a real app, this would be an API call to a backend
        // Here we'll simulate by generating mock data near the user's location
        fetchNearbyContent(location.coordinates.latitude, location.coordinates.longitude);
      } else {
        setLoading(false);
      }
    };
    
    fetchLocation();
    
    // Set up location watcher for real-time updates
    const unwatchLocation = locationService.startWatchingLocation((location: LocationStatus) => {
      setLocationStatus(location);
      
      if (location.status === 'success' && location.coordinates) {
        fetchNearbyContent(location.coordinates.latitude, location.coordinates.longitude);
      }
    });
    
    // Clean up on unmount
    return () => {
      unwatchLocation();
    };
  }, []);
  
  // Mock fetch nearby content - in a real app this would be an API call
  const fetchNearbyContent = useCallback((latitude: number, longitude: number) => {
    // Simulating API call with timeout
    setTimeout(() => {
      // Generate some mock nearby content with varying distances
      const mockContent: NearbyContentItem[] = [
        {
          id: 'nearby-video-1',
          type: 'video',
          title: 'Local Photography Meet-up',
          author: 'PhotoClub',
          date: '2 hours ago',
          description: 'Join us for a casual photography session in the park',
          category: 'art',
          forks: 12,
          distance: 0.3,
          distanceText: '300 m',
          importance: 'high',
          interestLevel: 90
        },
        {
          id: 'nearby-audio-1',
          type: 'audio',
          title: 'City Sounds Podcast',
          author: 'UrbanSounds',
          date: 'Today',
          description: 'Exploring the acoustic ecology of our neighborhood',
          category: 'music',
          forks: 8,
          distance: 1.2,
          distanceText: '1.2 km',
          importance: 'medium',
          interestLevel: 75
        },
        {
          id: 'nearby-thread-1',
          type: 'thread',
          title: 'Local Hiking Trails Discussion',
          author: 'TrailFinder',
          date: '1 day ago',
          content: 'Share your favorite hiking spots within 5km of downtown',
          category: 'outdoor',
          forks: 24,
          comments: 42,
          likes: 89,
          distance: 2.5,
          distanceText: '2.5 km',
          importance: 'medium',
          interestLevel: 82
        },
        {
          id: 'nearby-video-2',
          type: 'video',
          title: 'Street Food Festival Coverage',
          author: 'FoodieExplorer',
          date: '5 hours ago',
          description: 'Live from the international street food festival',
          category: 'food',
          forks: 19,
          distance: 0.7,
          distanceText: '700 m',
          importance: 'high',
          interestLevel: 88
        },
        {
          id: 'nearby-thread-2',
          type: 'thread',
          title: 'Neighborhood Gaming Tournament',
          author: 'GamersUnite',
          date: 'Yesterday',
          content: 'Join our local gaming competition this weekend',
          category: 'gaming',
          forks: 15,
          comments: 27,
          likes: 63,
          distance: 1.8,
          distanceText: '1.8 km',
          importance: 'medium',
          interestLevel: 79
        }
      ];
      
      // Sort by distance
      const sortedContent = mockContent.sort((a, b) => a.distance - b.distance);
      
      setNearbyContent(sortedContent);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Function to render content cards with appropriate icon and styling
  const renderContentCard = useCallback(({ item, index }: { item: NearbyContentItem, index: number }) => {
    // Calculate animation values for the parallax and scaling effects
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING * 2),
      index * (CARD_WIDTH + SPACING * 2),
      (index + 1) * (CARD_WIDTH + SPACING * 2),
    ];
    
    // Calculate scale for a focused vs unfocused card
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });
    
    // Calculate opacity for a focused vs unfocused card
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });
    
    // Calculate translateY for a focused vs unfocused card (slight up/down movement)
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [10, 0, 10],
      extrapolate: 'clamp',
    });
    
    // Get icon based on content type
    const getTypeIcon = () => {
      switch (item.type) {
        case 'video':
          return 'videocam';
        case 'audio':
          return 'headset';
        case 'thread':
          return 'forum';
        default:
          return 'article';
      }
    };
    
    // Get background color based on content type
    const getTypeColor = () => {
      switch (item.type) {
        case 'video':
          return '#3498DB';
        case 'audio':
          return '#9B59B6';
        case 'thread':
          return '#E67E22';
        default:
          return '#2C3E50';
      }
    };
    
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }, { translateY }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => onItemPress(item)}
        >
          {/* Card Header with Type and Distance */}
          <View style={styles.cardHeader}>
            <View style={[styles.typeTag, { backgroundColor: getTypeColor() }]}>
              <MaterialIcons name={getTypeIcon()} size={16} color="#FFFFFF" />
              <Text style={styles.typeText}>{item.type}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <MaterialIcons name="place" size={16} color="#BBBBBB" />
              <Text style={styles.distanceText}>{item.distanceText}</Text>
            </View>
          </View>
          
          {/* Card Content */}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            
            <Text style={styles.cardAuthor}>
              {item.author} • {item.date}
            </Text>
            
            <Text style={styles.cardDescription} numberOfLines={3}>
              {item.description || item.content || `A ${item.type} about ${item.category}`}
            </Text>
          </View>
          
          {/* Card Footer with Actions */}
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.forkButton}
              onPress={(e) => {
                e.stopPropagation();
                onFork(item);
              }}
            >
              <MaterialIcons name="call-split" size={16} color="#FFFFFF" />
              <Text style={styles.forkButtonText}>Fork ({item.forks})</Text>
            </TouchableOpacity>
            
            <View style={styles.actionButtons}>
              {item.type === 'thread' && (
                <View style={styles.statContainer}>
                  <MaterialIcons name="comment" size={16} color="#BBBBBB" />
                  <Text style={styles.statText}>{item.comments}</Text>
                </View>
              )}
              
              {item.likes && (
                <View style={styles.statContainer}>
                  <MaterialIcons name="thumb-up" size={16} color="#BBBBBB" />
                  <Text style={styles.statText}>{item.likes}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }, [scrollX, onItemPress, onFork]);
  
  // Scroll to index helper function
  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < nearbyContent.length && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };
  
  // Calculate dot indicator position
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { 
      useNativeDriver: true,
      listener: (event: { nativeEvent: { contentOffset: { x: number } } }) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / (CARD_WIDTH + SPACING * 2));
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      }
    }
  );
  
  // Render loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="place" size={32} color="#3498DB" />
        <Text style={styles.loadingText}>Finding content near you...</Text>
      </View>
    );
  }
  
  // Render error state
  if (locationStatus.status === 'error' || locationStatus.status === 'permission-denied') {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="location-off" size={48} color="#E74C3C" />
        <Text style={styles.errorTitle}>
          {locationStatus.status === 'permission-denied' 
            ? 'Location Permission Denied' 
            : 'Location Error'}
        </Text>
        <Text style={styles.errorMessage}>
          {locationStatus.error || 'Unable to access your location'}
        </Text>
      </View>
    );
  }
  
  // Render empty state
  if (nearbyContent.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="location-searching" size={48} color="#BBBBBB" />
        <Text style={styles.emptyTitle}>No Nearby Content</Text>
        <Text style={styles.emptyMessage}>
          There's no content available in your area yet.
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Happening Near You</Text>
      
      {/* Location indicator */}
      <View style={styles.locationIndicator}>
        <MaterialIcons name="my-location" size={16} color="#3498DB" />
        <Text style={styles.locationText}>
          {locationStatus.coordinates 
            ? 'Content near your current location' 
            : 'Using approximate location'}
        </Text>
      </View>
      
      {/* Horizontal card scroll with snap */}
      <FlatList
        ref={flatListRef}
        data={nearbyContent}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + SPACING * 2}
        snapToAlignment="center"
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        renderItem={renderContentCard}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {nearbyContent.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * (CARD_WIDTH + SPACING * 2),
              index * (CARD_WIDTH + SPACING * 2),
              (index + 1) * (CARD_WIDTH + SPACING * 2),
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          const scale = scrollX.interpolate({
            inputRange: [
              (index - 1) * (CARD_WIDTH + SPACING * 2),
              index * (CARD_WIDTH + SPACING * 2),
              (index + 1) * (CARD_WIDTH + SPACING * 2),
            ],
            outputRange: [1, 1.5, 1],
            extrapolate: 'clamp',
          });
          
          return (
            <TouchableOpacity
              key={index}
              onPress={() => scrollToIndex(index)}
              style={styles.dotButton}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity,
                    transform: [{ scale }],
                    backgroundColor: index === activeIndex ? '#3498DB' : '#BBBBBB',
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: SPACING,
    marginBottom: 8,
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#BBBBBB',
    marginLeft: 8,
  },
  scrollContent: {
    paddingLeft: SPACING,
    paddingRight: width - CARD_WIDTH - SPACING,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: SPACING * 2,
  },
  card: {
    backgroundColor: '#2A2A36',
    borderRadius: 12,
    padding: 16,
    height: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#BBBBBB',
    marginLeft: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardAuthor: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  forkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  forkButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: 12,
    color: '#BBBBBB',
    marginLeft: 4,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dotButton: {
    padding: 8, // Larger hit target
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  errorMessage: {
    color: '#BBBBBB',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyMessage: {
    color: '#BBBBBB',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default React.memo(HappeningNearYou);