import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ForkBoardViewProps, ContentItem } from "../../types/discover";

const { width } = Dimensions.get("window");

const ForkBoardView: React.FC<ForkBoardViewProps> = ({
  forkedContent,
  onItemPress,
}) => {
  // Sort forked content by ranking (highest first)
  const sortedContent = useMemo(() => {
    return [...forkedContent].sort(
      (a, b) => (b.ranking || 0) - (a.ranking || 0)
    );
  }, [forkedContent]);

  // Get appropriate icon for content type
  const getTypeIcon = (
    type: string
  ): React.ComponentProps<typeof MaterialIcons>["name"] => {
    switch (type) {
      case "video":
        return "videocam";
      case "audio":
        return "headset";
      case "thread":
        return "forum";
      default:
        return "description";
    }
  };

  // Render a forked content item
  const renderForkedItem = ({
    item,
    index,
  }: {
    item: ContentItem;
    index: number;
  }) => {
    const isFirstItem = index === 0;

    // Randomly rotate notes slightly for a handwritten effect
    const rotationAngle = ((parseInt(item.id.split("-")[2]) || 1) % 7) - 3;

    // For the first (featured) item, show a larger card
    if (isFirstItem) {
      return (
        <TouchableOpacity
          style={[
            styles.featuredItem,
            { transform: [{ rotate: `${rotationAngle}deg` }] },
          ]}
          onPress={() => onItemPress(item)}
          activeOpacity={0.85}
        >
          <View style={styles.featuredHeader}>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>Top</Text>
            </View>
          </View>

          <Text style={styles.featuredDescription} numberOfLines={3}>
            {item.description || item.content || `By ${item.author}`}
          </Text>

          <View style={styles.featuredFooter}>
            <View style={styles.featuredMeta}>
              <MaterialIcons
                name={getTypeIcon(item.type)}
                size={14}
                color="#BBBBBB"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.featuredMetaText}>{item.author}</Text>
            </View>

            <View style={styles.rankingContainer}>
              <MaterialIcons name="star" size={14} color="#F1C40F" />
              <Text style={styles.rankingText}>{item.ranking}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // For regular items, show a standard card
    return (
      <TouchableOpacity
        style={[
          styles.forkedItem,
          { transform: [{ rotate: `${rotationAngle}deg` }] },
        ]}
        onPress={() => onItemPress(item)}
        activeOpacity={0.85}
      >
        <Text style={styles.forkedItemTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.forkedItemMeta}>
          {item.author} • {item.date}
        </Text>
        <View style={styles.forkedItemFooter}>
          <View style={styles.forkedItemTypeContainer}>
            <MaterialIcons
              name={getTypeIcon(item.type)}
              size={12}
              color="#BBBBBB"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.forkedItemTypeText}>
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </Text>
          </View>

          <View style={styles.rankingContainer}>
            <MaterialIcons name="star" size={12} color="#F1C40F" />
            <Text style={styles.rankingText}>{item.ranking}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Empty state when no content has been forked
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="call-split" size={64} color="#BBBBBB" />
      <Text style={styles.emptyTitle}>No Forked Content</Text>
      <Text style={styles.emptySubtitle}>
        Forked content will appear here for later reference
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedContent}
        renderItem={renderForkedItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.contentContainer}
        numColumns={2}
        columnWrapperStyle={
          sortedContent.length > 1 ? styles.columnWrapper : undefined
        }
        ListHeaderComponent={
          <Text style={styles.headerText}>
            Your Fork-Board ({sortedContent.length})
          </Text>
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2A",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for bottom bar
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  featuredItem: {
    backgroundColor: "#FFEC8B",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  featuredTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginRight: 8,
  },
  featuredBadge: {
    backgroundColor: "#3498DB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  featuredDescription: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredMetaText: {
    fontSize: 12,
    color: "#777777",
  },
  forkedItem: {
    width: (width - 48) / 2, // Account for padding and gap
    backgroundColor: "#FFFACD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  forkedItemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  forkedItemMeta: {
    fontSize: 12,
    color: "#777777",
    marginBottom: 12,
  },
  forkedItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forkedItemTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  forkedItemTypeText: {
    fontSize: 10,
    color: "#777777",
  },
  rankingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#F1C40F",
    marginLeft: 4,
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
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
  },
});

export default memo(ForkBoardView);
