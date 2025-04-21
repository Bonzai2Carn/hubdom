// src/components/discover/CanvasView.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  Animated,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/hooks';
import { Surface, Badge, Chip } from 'react-native-paper';

// Define interface for hobby categories
interface HobbyCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  communitySize?: number;
  activeEvents?: number;
}

// Define interface for discovery content
interface DiscoveryContent {
  id: string;
  title: string;
  type: 'event' | 'discussion' | 'showcase' | 'challenge';
  category: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  participants: number;
  mediaUrl?: string;
  featured: boolean;
  location?: string;
  date?: string;
  badges?: string[];
}

const { width } = Dimensions.get('window');

interface CanvasViewProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  searchQuery: string;
  onContentSelect: (content: DiscoveryContent) => void;
  // onCreateHobby: () => void;
}

const CanvasView: React.FC<CanvasViewProps> = ({
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onContentSelect,
  // onCreateHobby
}) => {
  // Animation values
  const [scrollY] = useState(new Animated.Value(0));
  const [activeView, setActiveView] = useState<'categories' | 'trending' | 'community'>('categories');
  
  // State for user's location and preferences
  const userLocation = useAppSelector(state => state.user?.location);
  
  // Define all available hobby categories
  const HOBBY_CATEGORIES: HobbyCategory[] = [
    {
      id: "artistic",
      name: "Artistic",
      icon: "palette",
      color: "#EC4899",
      description: "Express yourself through various art forms",
      communitySize: 7832,
      activeEvents: 124
    },
    {
      id: "outdoor",
      name: "Outdoor",
      icon: "terrain",
      color: "#10B981",
      description: "Connect with nature and adventure",
      communitySize: 9651,
      activeEvents: 213
    },
    // ... other categories
  ];
  
  // Sample trending content
  const TRENDING_CONTENT: DiscoveryContent[] = [
    {
      id: "trend1",
      title: "Weekend Photography Workshop",
      type: "event",
      category: "artistic",
      creator: { id: "user1", name: "Alex Chen" },
      participants: 28,
      mediaUrl: "/api/placeholder/400/200",
      featured: true,
      location: "Central Park",
      date: "Tomorrow, 2pm",
      badges: ["New", "Popular"]
    },
    // ... other trending content
  ];
  
  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return HOBBY_CATEGORIES;
    
    return HOBBY_CATEGORIES.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, HOBBY_CATEGORIES]);
  
  // Render category card with animation
  const renderCategoryCard = ({ item, index }: { item: HobbyCategory, index: number }) => {
    const isSelected = selectedCategory === item.id;
    
    return (
      <Animated.View 
        style={[
          styles.categoryCard,
          {
            transform: [{ 
              scale: scrollY.interpolate({
                inputRange: [(index - 1) * 160, index * 160, (index + 1) * 160],
                outputRange: [0.9, 1.0, 0.9],
                extrapolate: 'clamp'
              })
            }],
            borderColor: item.color,
          },
          isSelected && { borderWidth: 2 }
        ]}
      >
        <TouchableOpacity 
          style={styles.categoryCardInner}
          onPress={() => onCategorySelect(item.id)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <MaterialIcons name={item.icon as any} size={32} color="#FFFFFF" />
          </View>
          
          <View style={styles.categoryContent}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categoryDescription} numberOfLines={2}>
              {item.description}
            </Text>
            
            {item.communitySize && (
              <View style={styles.communityStats}>
                <Text style={styles.statText}>
                  <MaterialIcons name="people" size={14} color={item.color} />
                  {' '}{item.communitySize.toLocaleString()} members
                </Text>
                {item.activeEvents && (
                  <Text style={styles.statText}>
                    <MaterialIcons name="event" size={14} color={item.color} />
                    {' '}{item.activeEvents} events
                  </Text>
                )}
              </View>
            )}
          </View>
          
          <MaterialIcons 
            name="chevron-right" 
            size={24} 
            color="#BBBBBB"
            style={styles.cardArrow}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  // Render trending content card
  const renderTrendingCard = ({ item }: { item: DiscoveryContent }) => (
    <Surface style={styles.trendingCard}>
      <TouchableOpacity
        style={styles.trendingCardInner}
        onPress={() => onContentSelect(item)}
        activeOpacity={0.7}
      >
        {item.mediaUrl && (
          <Image 
            source={{ uri: item.mediaUrl }} 
            style={styles.trendingImage}
          />
        )}
        
        <View style={styles.trendingContent}>
          <View style={styles.trendingHeader}>
            <Text style={styles.trendingTitle}>{item.title}</Text>
            {item.featured && (
              <Badge style={styles.featuredBadge}>Featured</Badge>
            )}
          </View>
          
          <View style={styles.trendingMeta}>
            <Chip 
              icon={getTypeIcon(item.type)} 
              style={styles.typeChip}
            >
              {getTypeLabel(item.type)}
            </Chip>
            
            {item.location && (
              <Text style={styles.locationText}>
                <MaterialIcons name="place" size={14} color="#BBBBBB" />
                {' '}{item.location}
              </Text>
            )}
            
            {item.date && (
              <Text style={styles.dateText}>
                <MaterialIcons name="schedule" size={14} color="#BBBBBB" />
                {' '}{item.date}
              </Text>
            )}
          </View>
          
          <View style={styles.participantInfo}>
            <Text style={styles.participantText}>
              <MaterialIcons name="people" size={14} color="#3498DB" />
              {' '}{item.participants} participating
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Surface>
  );
  
  // Helper functions for trending content
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'event': return 'event';
      case 'discussion': return 'forum';
      case 'showcase': return 'collections';
      case 'challenge': return 'emoji-events';
      default: return 'info';
    }
  };
  
  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'event': return 'Event';
      case 'discussion': return 'Discussion';
      case 'showcase': return 'Showcase';
      case 'challenge': return 'Challenge';
      default: return 'Info';
    }
  };
  
  // View selector component
  const ViewSelector = () => (
    <View style={styles.viewSelector}>
      <TouchableOpacity
        style={[
          styles.viewOption,
          activeView === 'categories' && styles.activeViewOption
        ]}
        onPress={() => setActiveView('categories')}
      >
        <MaterialIcons
          name="category"
          size={24}
          color={activeView === 'categories' ? '#3498DB' : '#BBBBBB'}
        />
        <Text style={[
          styles.viewOptionText,
          activeView === 'categories' && styles.activeViewOptionText
        ]}>
          Categories
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.viewOption,
          activeView === 'trending' && styles.activeViewOption
        ]}
        onPress={() => setActiveView('trending')}
      >
        <MaterialIcons
          name="trending-up"
          size={24}
          color={activeView === 'trending' ? '#3498DB' : '#BBBBBB'}
        />
        <Text style={[
          styles.viewOptionText,
          activeView === 'trending' && styles.activeViewOptionText
        ]}>
          Trending
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.viewOption,
          activeView === 'community' && styles.activeViewOption
        ]}
        onPress={() => setActiveView('community')}
      >
        <MaterialIcons
          name="people"
          size={24}
          color={activeView === 'community' ? '#3498DB' : '#BBBBBB'}
        />
        <Text style={[
          styles.viewOptionText,
          activeView === 'community' && styles.activeViewOptionText
        ]}>
          For You
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render appropriate content based on active view
  const renderContent = () => {
    switch (activeView) {
      case 'categories':
        return (
          <Animated.FlatList
            data={filteredCategories}
            renderItem={renderCategoryCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.categoryList}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="search-off" size={64} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No categories found</Text>
                <Text style={styles.emptySubtext}>
                  Try a different search term or create your own hobby category
                </Text>
                <TouchableOpacity
                  style={styles.createButton}
                  // onPress={onCreateHobby}
                >
                  <MaterialIcons name="add" size={18} color="#FFFFFF" />
                  <Text style={styles.createButtonText}>Create Hobby</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        );
      
      case 'trending':
        return (
          <FlatList
            data={TRENDING_CONTENT}
            renderItem={renderTrendingCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.trendingList}
            showsVerticalScrollIndicator={false}
          />
        );
      
      case 'community':
        return (
          <ScrollView style={styles.communityContainer}>
            <View style={styles.personalizedSection}>
              <Text style={styles.sectionTitle}>Based on your interests</Text>
              {/* Personalized content here */}
            </View>
            
            <View style={styles.nearbySection}>
              <Text style={styles.sectionTitle}>Near you</Text>
              {/* Nearby content here */}
            </View>
            
            <View style={styles.recommendedSection}>
              <Text style={styles.sectionTitle}>Recommended for you</Text>
              {/* Recommended content here */}
            </View>
          </ScrollView>
        );
    }
  };
  
  return (
    <View style={styles.container}>
      <ViewSelector />
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2A',
  },
  viewSelector: {
    flexDirection: 'row',
    backgroundColor: '#2A2A36',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  viewOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
  },
  activeViewOption: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498DB',
  },
  viewOptionText: {
    color: '#BBBBBB',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeViewOptionText: {
    color: '#3498DB',
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
    overflow: 'hidden',
  },
  categoryCardInner: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContent: {
    flex: 1,
    marginLeft: 16,
  },
  categoryName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  categoryDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: 8,
  },
  communityStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  cardArrow: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  trendingList: {
    padding: 16,
  },
  trendingCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(42, 42, 54, 0.8)',
  },
  trendingCardInner: {
    borderRadius: 12,
  },
  trendingImage: {
    width: '100%',
    height: 160,
  },
  trendingContent: {
    padding: 16,
  },
  trendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  featuredBadge: {
    backgroundColor: '#FF7F50',
  },
  trendingMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  typeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
    marginBottom: 8,
  },
  locationText: {
    color: '#BBBBBB',
    fontSize: 12,
    marginRight: 12,
  },
  dateText: {
    color: '#BBBBBB',
    fontSize: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  communityContainer: {
    flex: 1,
  },
  personalizedSection: {
    marginBottom: 24,
    padding: 16,
  },
  nearbySection: {
    marginBottom: 24,
    padding: 16,
  },
  recommendedSection: {
    marginBottom: 24,
    padding: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default CanvasView;