import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
import {useRouter} from 'expo-router';

// Import sub-components
import GridView from '../../components/discover/GridView';
import CanvasView from '../../components/discover/CanvasView';
import ForkBoardView from '../../components/discover/ForkBoardView';
import HappeningNearYou from '../../components/discover/NearYou';
import ContentDetailModal from '../../components/contents/ContentDetailModal';
import CreateEventModal from '../../components/events/CreateEventModal';
import DiscoverHeader from '../../components/discover/DiscoverHeader';
import FilterBar from '../../components/discover/FilterBar';
import SearchBar from '../../components/discover/SearchBar';

// Import types
import { ContentItem, ContentType } from '../../types/discover';
import { generateContent } from '../../utils/mockData';
import { theme } from '../../utils/theme';

// Define view mode types
type ViewMode = 'grid' | 'canvas';
type CurrentTab = 'discover' | 'forkBoard';
// Modified ActiveTab to include 'nearYou'
type ActiveTab = 'forYou' | 'trending' | 'nearYou';

const DiscoverScreen: React.FC = () => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  // State management
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [currentTab, setCurrentTab] = useState<CurrentTab>('discover');
  const [activeTab, setActiveTab] = useState<ActiveTab>('forYou');
  const [contentFilter, setContentFilter] = useState<ContentType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [content, setContent] = useState<ContentItem[]>(generateContent());
  const [forkedContent, setForkedContent] = useState<ContentItem[]>([]);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(true);


  // const navigation = useNavigation();
  const router = useRouter();

  // Load forked content from storage (simulated)
  useEffect(() => {
    // In a real app, we would fetch from AsyncStorage or an API
    // For demo, we'll use a subset of the generated content
    setForkedContent(content.filter(item => item.importance === 'high').slice(0, 3));
    
    // Show onboarding tip with animation
    if (showTip) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      
      // Auto-hide tip after 5 seconds
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowTip(false));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Helper function to ensure the item has the required number type for forks
  const ensureValidItem = useCallback((item: any): ContentItem => {
    return {
      ...item,
      forks: typeof item.forks === 'number' ? item.forks : 0
    };
  }, []);

  // Memoized handler functions
  const handleFork = useCallback((item: ContentItem) => {
    const isAlreadyForked = forkedContent.some(
      (forkedItem) => forkedItem.id === item.id
    );

    if (!isAlreadyForked) {
      const itemWithRanking = {
        ...item,
        ranking: Math.floor((item.interestLevel || 50) + Math.random() * 30),
      };
      // Show success feedback
      alert(`${item.title} has been forked to your collection!`);
      } else {
        alert("This item is already in your collection.");
      }
  }, [forkedContent]);

  const toggleViewMode = useCallback(() => {
    setViewMode((prevMode) => (prevMode === 'grid' ? 'canvas' : 'grid'));
  }, []);

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const toggleSearchBar = useCallback(() => {
    setShowSearchBar((prev) => !prev);
    if (showSearchBar) {
      setSearchQuery('');
    }
  }, [showSearchBar]);

  const toggleCurrentTab = useCallback(() => {
    setCurrentTab((prevTab) => {
      // When switching to/from fork board, reset some states
      if (prevTab === 'discover') {
        // Switching to fork board
        setSelectedItem(null);
        setSearchQuery('');
      } else {
        // Switching to discover
        setActiveTab('forYou');
      }
      return prevTab === 'discover' ? 'forkBoard' : 'discover';
    });
  }, []);

  // Create event handler for CreateEventModal
  const handleCreateEvent = useCallback((eventData: any) => {
    console.log('Creating event with data:', eventData);
    setIsCreateModalOpen(false);
    
    // Show confirmation
    alert('Your event has been created successfully!');
    
    // In a real app, we'd create the event via API and then update our state
  }, []);

  // Handle item selection
  const handleItemPress = useCallback((item: ContentItem) => {
    setSelectedItem(ensureValidItem(item));
  }, [ensureValidItem]);

  // Dismiss onboarding tip
  const dismissTip = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowTip(false));
  }, [slideAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      {/* Header with title and action buttons */}
      <DiscoverHeader 
        currentTab={currentTab}
        showSearchBar={showSearchBar}
        onToggleSearchBar={toggleSearchBar}
        onToggleViewMode={toggleViewMode}
        onToggleCurrentTab={toggleCurrentTab}
      />

      {/* Search bar when active */}
      {showSearchBar && (
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onCancel={toggleSearchBar}
        />
      )}
      
      {/* Onboarding tip */}
      {showTip && (
        <Animated.View 
          style={[
            styles.tipContainer,
            {
              opacity: slideAnim,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.tipContent}>
            <MaterialIcons name="lightbulb" size={24} color="#FFCA28" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              {currentTab === 'discover' 
                ? "Explore content and fork what interests you to save it to your collection" 
                : "Your forked content is a personal collection for collaboration and reference"}
            </Text>
            <TouchableOpacity style={styles.tipCloseButton} onPress={dismissTip}>
              <MaterialIcons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Custom tabs for "For You", "Trending", and "Near You" */}
      {currentTab === 'discover' && viewMode === 'grid' && (
        <>
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'forYou' && styles.activeTab
              ]}
              onPress={() => setActiveTab('forYou')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'forYou' && styles.activeTabText
              ]}>
                For You
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'trending' && styles.activeTab
              ]}
              onPress={() => setActiveTab('trending')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'trending' && styles.activeTabText
              ]}>
                Trending
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.tab, 
                activeTab === 'nearYou' && styles.activeTab
              ]}
              onPress={() => setActiveTab('nearYou')}
            >
              <View style={styles.tabWithIcon}>
                <MaterialIcons
                  name="place"
                  size={16} 
                  color={activeTab === 'nearYou' ? theme.colors.primary : "#BBBBBB"} 
                />
                <Text style={[
                  styles.tabText,
                  activeTab === 'nearYou' && styles.activeTabText
                ]}>
                  Near You
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Only show content filter when not in "Near You" tab */}
          {activeTab !== 'nearYou' && (
            <FilterBar 
              contentFilter={contentFilter}
              onFilterChange={setContentFilter}
            />
          )}
        </>
      )}
      
      {/* Main content area */}
      <View style={styles.content}>
        {/* Discover tab content */}
        {currentTab === 'discover' && (
          <>
            {/* Near You view */}
            {activeTab === 'nearYou' && viewMode === 'grid' ? (
              <HappeningNearYou
                onItemPress={handleItemPress}
                onFork={handleFork}
              />
            ) : (
              // Grid or Canvas view
              viewMode === 'grid' ? (
                <GridView
                  content={content}
                  selectedCategory={selectedCategory}
                  activeTab={activeTab}
                  contentFilter={contentFilter}
                  searchQuery={searchQuery}
                  onItemPress={handleItemPress}
                  onFork={handleFork}
                />
              ) : (
                <CanvasView
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategorySelect}
                  searchQuery={searchQuery}
                  onContentSelect={(content) => handleItemPress(content)}
                />
              )
            )}
          </>
        )}
        
        {/* Fork Board tab content */}
        {currentTab === 'forkBoard' && (
          <ForkBoardView
            forkedContent={forkedContent}
            onItemPress={handleItemPress}
          />
        )}
      </View>
      
      {/* Bottom action bar - will go to the top instead */}
      {/* <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsCreateModalOpen(true)}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>
            {currentTab === 'discover' ? 'Create Content' : 'Collaborate'}
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* Content detail modal */}
      <ContentDetailModal
        visible={selectedItem !== null}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onFork={handleFork}
      />

      {/* Create event/content modal */}
      <CreateEventModal
        isVisible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </SafeAreaView>
  );
};

// Styles defined within the component file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(30, 30, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  // Custom tabs styles
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#BBBBBB',
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  tabWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Tip styles
  tipContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 2,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 42, 54, 0.95)',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFCA28',
  },
  tipIcon: {
    marginRight: 12,
  },
  tipText: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  tipCloseButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default DiscoverScreen;