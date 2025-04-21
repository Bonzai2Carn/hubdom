import React, { memo, useMemo, useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  Dimensions,
  ActivityIndicator,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';

import { MaterialIcons } from "@expo/vector-icons";
import { GridViewProps, ContentItem } from "../../types/discover";

// Import card components
import VideoCard from "../contents/VideoCard";
import AudioCard from "../contents/AudioCard";
import ThreadCard from "../contents/ThreadCard";

const { width, height } = Dimensions.get("window");

const GridView: React.FC<GridViewProps> = ({
  content,
  selectedCategory,
  activeTab,
  contentFilter,
  searchQuery,
  onItemPress,
  onFork,
}) => {

  // Filter content based on category, type, and search
  const filteredContent = useMemo(() => {
    return content.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesType =
        contentFilter === "all" || item.type === contentFilter;
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.content &&
          item.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description &&
          item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [content, selectedCategory, contentFilter, searchQuery]);

  // Sort content based on active tab
  const sortedContent = useMemo(() => {
    const sorted = [...filteredContent];
    if (activeTab === "forYou") {
      // For "For You" tab, sort by user interest level
      sorted.sort((a, b) => (b.interestLevel || 0) - (a.interestLevel || 0));
    } else {
      // For "Trending" tab, sort by popularity (forks + likes)
      sorted.sort((a, b) => {
        const aPopularity = a.forks + (a.likes || 0);
        const bPopularity = b.forks + (b.likes || 0);
        return bPopularity - aPopularity;
      });
    }
    return sorted;
  }, [filteredContent, activeTab]);


  
  // Render different card types based on content type
  const renderContentItem = ({ item }: { item: ContentItem }) => {
    switch (item.type) {
      case "video":
        return <VideoCard item={item} onPress={onItemPress} onFork={onFork} />;
      case "audio":
        return <AudioCard item={item} onPress={onItemPress} onFork={onFork} />;
      case "thread":
        return <ThreadCard item={item} onPress={onItemPress} onFork={onFork} />;
      default:
        return null;
    }
  };
  

  // Empty state when no content matches filters
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="search-off" size={64} color="#BBBBBB" />
      <Text style={styles.emptyTitle}>No Results Found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or search criteria
      </Text>
    </View>
  );
  
  return (
    <FlatList
      data={sortedContent}
      renderItem={renderContentItem}
      keyExtractor={(item) => item.id}
      pagingEnabled
      snapToAlignment="center"
      snapToInterval={100} // Adjust for margin
      // snapToInterval={CONTENT_CARD_WIDTH + CONTENT_CARD_MARGIN * 4} // Adjust for margin
      decelerationRate={"fast"}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmptyState}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    // paddingBottom: 80, // Extra space for bottom bar
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: 8,
    maxWidth: width * 0.7,
  },
});

export default memo(GridView);
