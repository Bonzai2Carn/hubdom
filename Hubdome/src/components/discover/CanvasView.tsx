import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
  LayoutAnimation,
  UIManager
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CanvasViewProps, ContentItem } from "../../types/discover";
import StickyNote from "./StickyNote";
import { CATEGORIES } from "../../utils/mockData";

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get("window");

// Define category cluster positions (for canvas mode)
const CATEGORY_POSITIONS = {
  sports: { x: width * 0.2, y: height * 0.2 },
  art: { x: width * 0.7, y: height * 0.15 },
  music: { x: width * 0.5, y: height * 0.4 },
  gaming: { x: width * 0.2, y: height * 0.6 },
  outdoor: { x: width * 0.8, y: height * 0.5 },
  tech: { x: width * 0.3, y: height * 0.35 },
  food: { x: width * 0.7, y: height * 0.7 },
  books: { x: width * 0.1, y: height * 0.8 },
};

const CanvasView: React.FC<CanvasViewProps> = ({
  content,
  selectedCategory,
  searchQuery,
  onCategorySelect,
  onItemPress,
  onFork,
}) => {
  // State for canvas position and scale
  const [scale, setScale] = useState<number>(0.6);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(selectedCategory !== 'all' ? selectedCategory : null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canvasMode, setCanvasMode] = useState<'clusters' | 'grid'>(selectedCategory === 'all' ? 'clusters' : 'grid');
  
  // Animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const zoomAnim = useRef(new Animated.Value(scale)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Memoize filtered content based on category and search
  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content &&
          item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [content, selectedCategory, searchQuery]);

  // Group content by category
  const contentByCategory = useMemo(() => {
    const result: Record<string, ContentItem[]> = {};
    CATEGORIES.forEach((category) => {
      result[category.id] = filteredContent
        .filter((item) => item.category === category.id)
        .sort((a, b) => (b.interestLevel || 0) - (a.interestLevel || 0));
    });
    return result;
  }, [filteredContent]);

  // Filter visible categories
  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter(category => 
      contentByCategory[category.id]?.length > 0 && 
      (selectedCategory === 'all' || category.id === selectedCategory)
    );
  }, [contentByCategory, selectedCategory]);

  // Calculate note positions for canvas view
  const getNotePositions = useCallback((categoryId: string, itemIndex: number, total: number) => {
    if (!CATEGORY_POSITIONS[categoryId as keyof typeof CATEGORY_POSITIONS]) {
      // Fallback for unknown categories
      return { x: width * 0.5, y: height * 0.5 };
    }
    
    const basePosition = CATEGORY_POSITIONS[categoryId as keyof typeof CATEGORY_POSITIONS];
    const radius = 100 * scale;
    const angle = (2 * Math.PI * itemIndex) / Math.max(total, 1);
    
    return {
      x: basePosition.x + radius * Math.cos(angle),
      y: basePosition.y + radius * Math.sin(angle),
    };
  }, [scale]);

  // Calculate rotation angle for sticky notes
  const getRotationAngle = useCallback((itemId: string) => {
    // Create a deterministic but seemingly random rotation
    const charCodeSum = itemId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return (charCodeSum % 10) - 5; // Range from -5 to 5 degrees
  }, []);

  // Set up pan responder for dragging the canvas
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => canvasMode === 'clusters',
      onMoveShouldSetPanResponder: () => canvasMode === 'clusters',
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    });
  }, [pan, canvasMode]);

  // Navigation controls for the canvas
  const zoomIn = useCallback(() => {
    const newScale = Math.min(scale * 1.2, 2);
    setScale(newScale);
    
    // Animate the zoom
    Animated.timing(zoomAnim, {
      toValue: newScale,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [scale, zoomAnim]);
  
  const zoomOut = useCallback(() => {
    const newScale = Math.max(scale * 0.8, 0.3);
    setScale(newScale);
    
    // Animate the zoom
    Animated.timing(zoomAnim, {
      toValue: newScale,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [scale, zoomAnim]);
  
  const resetView = useCallback(() => {
    setScale(0.6);
    
    Animated.parallel([
      Animated.timing(zoomAnim, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(pan, {
        toValue: { x: 0, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [zoomAnim, pan]);

  // Focus on a specific category
  const focusCategory = useCallback((categoryId: string) => {
    setIsLoading(true);
    
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      // Switch to grid mode
      setCanvasMode('grid');
      setFocusedCategory(categoryId);
      onCategorySelect(categoryId);
      
      // Use layout animation for smooth transition
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      
      // Fade back in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        delay: 100,
      }).start(() => {
        setIsLoading(false);
      });
    });
  }, [fadeAnim, onCategorySelect]);

  // Return to clusters view
  const returnToClusters = useCallback(() => {
    setIsLoading(true);
    
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      setCanvasMode('clusters');
      setFocusedCategory(null);
      onCategorySelect('all');
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
        delay: 100,
      }).start(() => {
        setIsLoading(false);
      });
    });
  }, [fadeAnim, onCategorySelect]);

  // Render content in grid mode (when focused on a category)
  const renderGridContent = () => {
    if (!focusedCategory) return null;
    
    const categoryItems = contentByCategory[focusedCategory] || [];
    const categoryInfo = CATEGORIES.find(cat => cat.id === focusedCategory);
    
    if (categoryItems.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialIcons name="search-off" size={64} color="#BBBBBB" />
          <Text style={styles.emptyStateText}>No items found</Text>
        </View>
      );
    }
    
    // Group by content type
    const videoItems = categoryItems.filter(item => item.type === 'video');
    const audioItems = categoryItems.filter(item => item.type === 'audio');
    const threadItems = categoryItems.filter(item => item.type === 'thread');
    
    return (
      <ScrollView style={styles.gridContainer}>
        <View style={styles.gridHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={returnToClusters}
          >
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.gridHeaderTitle}>
            {categoryInfo?.name || focusedCategory}
          </Text>
        </View>
        
        {/* Videos section */}
        {videoItems.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Videos</Text>
            <View style={styles.gridItems}>
              {videoItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => onItemPress(item)}
                >
                  <View style={styles.gridItemThumbnail}>
                    <MaterialIcons name="play-circle-filled" size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.gridItemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.gridItemAuthor} numberOfLines={1}>
                    {item.author}
                  </Text>
                  <TouchableOpacity
                    style={styles.gridItemForkButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onFork(item);
                    }}
                  >
                    <MaterialIcons name="call-split" size={16} color="#FFFFFF" />
                    <Text style={styles.gridItemForkText}>{item.forks}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Audio section */}
        {audioItems.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Audio</Text>
            <View style={styles.gridItems}>
              {audioItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => onItemPress(item)}
                >
                  <View style={[styles.gridItemThumbnail, styles.audioThumbnail]}>
                    <MaterialIcons name="headset" size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.gridItemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.gridItemAuthor} numberOfLines={1}>
                    {item.author}
                  </Text>
                  <TouchableOpacity
                    style={styles.gridItemForkButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onFork(item);
                    }}
                  >
                    <MaterialIcons name="call-split" size={16} color="#FFFFFF" />
                    <Text style={styles.gridItemForkText}>{item.forks}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {/* Threads section */}
        {threadItems.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Threads</Text>
            <View style={styles.gridItems}>
              {threadItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.gridItem}
                  onPress={() => onItemPress(item)}
                >
                  <View style={[styles.gridItemThumbnail, styles.threadThumbnail]}>
                    <MaterialIcons name="forum" size={32} color="#FFFFFF" />
                  </View>
                  <Text style={styles.gridItemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.gridItemAuthor} numberOfLines={1}>
                    {item.author}
                  </Text>
                  <TouchableOpacity
                    style={styles.gridItemForkButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onFork(item);
                    }}
                  >
                    <MaterialIcons name="call-split" size={16} color="#FFFFFF" />
                    <Text style={styles.gridItemForkText}>{item.forks}</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  // Render canvas clusters mode
  const renderCanvasClusters = () => {
    return (
      <Animated.View
        style={[
          styles.canvasContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: zoomAnim },
            ],
            opacity: fadeAnim,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Render category labels */}
        {visibleCategories.map((category) => {
          const basePos = CATEGORY_POSITIONS[category.id as keyof typeof CATEGORY_POSITIONS];
          if (!basePos) return null;
          
          const items = contentByCategory[category.id];
          if (!items || items.length === 0) return null;
          
          return (
            <React.Fragment key={`label-${category.id}`}>
              {/* Category label bubble */}
              <TouchableOpacity
                style={[
                  styles.categoryBubble,
                  {
                    left: basePos.x - 50,
                    top: basePos.y - 30,
                    backgroundColor: category.darkColor,
                  },
                ]}
                onPress={() => focusCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryItemCount}>{items.length}</Text>
              </TouchableOpacity>
              
              {/* Render sticky notes for this category */}
              {items.slice(0, 5).map((item, index) => {
                const position = getNotePositions(category.id, index, Math.min(items.length, 5));
                return (
                  <StickyNote
                    key={item.id}
                    item={item}
                    position={position}
                    rotationAngle={getRotationAngle(item.id)}
                    onPress={onItemPress}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Canvas controls */}
      {canvasMode === 'clusters' && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={zoomIn}
          >
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={zoomOut}
          >
            <MaterialIcons name="remove" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={resetView}
          >
            <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
      
      {/* Loading indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3498DB" />
        </View>
      )}
      
      {/* Render appropriate view based on mode */}
      {canvasMode === 'clusters' ? renderCanvasClusters() : renderGridContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2A",
  },
  canvasContainer: {
    flex: 1,
    width: width * 2,
    height: height * 2,
    position: "absolute",
    top: -height / 2,
    left: -width / 2,
  },
  controlsContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(42, 42, 54, 0.8)",
    borderRadius: 8,
    paddingVertical: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryBubble: {
    position: "absolute",
    width: 100,
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  categoryItemCount: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.7)",
  },
  gridContainer: {
    flex: 1,
    padding: 16,
  },
  gridHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  gridHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  gridItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: width / 2 - 24,
    marginBottom: 16,
    backgroundColor: "#2A2A36",
    borderRadius: 8,
    overflow: "hidden",
  },
  gridItemThumbnail: {
    height: 100,
    backgroundColor: "#3498DB",
    justifyContent: "center",
    alignItems: "center",
  },
  audioThumbnail: {
    backgroundColor: "#9B59B6",
  },
  threadThumbnail: {
    backgroundColor: "#E67E22",
  },
  gridItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginHorizontal: 8,
    marginTop: 8,
  },
  gridItemAuthor: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginHorizontal: 8,
    marginTop: 4,
  },
  gridItemForkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 152, 219, 0.2)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    margin: 8,
  },
  gridItemForkText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginTop: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30, 30, 42, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
});

export default React.memo(CanvasView);