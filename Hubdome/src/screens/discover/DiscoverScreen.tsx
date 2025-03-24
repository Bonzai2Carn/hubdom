import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
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
import ContentDetailModal from '../../components/discover/ContentDetailModal';
import CreateEventModal from '../../components/events/CreateEventModal';
import DiscoverHeader from '../../components/discover/DiscoverHeader';
import FilterBar from '../../components/discover/FilterBar';
import SearchBar from '../../components/discover/SearchBar';

// Import types
import { ContentItem, ContentType } from '../../types/discover';
import { generateContent } from '../../utils/mockData';

// Define view mode types
type ViewMode = 'grid' | 'canvas';
type CurrentTab = 'discover' | 'forkBoard';
// Modified ActiveTab to include 'nearYou'
type ActiveTab = 'forYou' | 'trending' | 'nearYou';

const DiscoverScreen: React.FC = () => {
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

  // const navigation = useNavigation();
  const router = useRouter();

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

      setForkedContent((prevForked) => [...prevForked, itemWithRanking]);
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
    setCurrentTab(currentTab === 'discover' ? 'forkBoard' : 'discover');
  }, [currentTab]);

  // Render tabs for discover mode
  const renderTabs = () => {
    if (currentTab !== 'discover' || viewMode !== 'grid') return null;

    return (
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
                color={activeTab === 'nearYou' ? "#3498DB" : "#BBBBBB"} 
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
    );
  };

  // Render the main content based on the current tab, view mode, and active tab
  const renderMainContent = () => {
    if (currentTab === 'discover') {
      // If in "Near You" tab, show the location-based content
      if (activeTab === 'nearYou' && viewMode === 'grid') {
        return (
          <HappeningNearYou
            onItemPress={(item) => setSelectedItem(ensureValidItem(item))}
            onFork={(item) => handleFork(ensureValidItem(item))}
          />
        );
      }
      
      // Otherwise, show either grid or canvas view
      return viewMode === 'grid' ? (
        <GridView
          content={content}
          selectedCategory={selectedCategory}
          activeTab={activeTab}
          contentFilter={contentFilter}
          searchQuery={searchQuery}
          onItemPress={(item) => setSelectedItem(ensureValidItem(item))}
          onFork={(item) => handleFork(ensureValidItem(item))}
        />
      ) : (
        <CanvasView
          content={content}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategorySelect={handleCategorySelect}
          onItemPress={(item) => setSelectedItem(ensureValidItem(item))}
          onFork={(item) => handleFork(ensureValidItem(item))}
        />
      );
    } else {
      // If in forkboard tab, show forked content
      return (
        <ForkBoardView
          forkedContent={forkedContent}
          onItemPress={(item) => setSelectedItem(ensureValidItem(item))}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2A" />

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

      {/* Custom tabs for "For You", "Trending", and "Near You" */}
      {renderTabs()}

      {/* Main content area */}
      <View style={styles.content}>
        {renderMainContent()}
      </View>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsCreateModalOpen(true)}
        >
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {/* Content detail modal */}
      <ContentDetailModal
        visible={selectedItem !== null}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onFork={handleFork}
      />

      {/* Create event modal */}
      <CreateEventModal
        isVisible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </SafeAreaView>
  );
};

// Styles defined within the component file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2A',
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
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  // Custom tabs styles
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A2A36',
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
    borderBottomColor: '#3498DB',
  },
  tabText: {
    fontSize: 14,
    color: '#BBBBBB',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3498DB',
    fontWeight: 'bold',
  },
  tabWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default DiscoverScreen;