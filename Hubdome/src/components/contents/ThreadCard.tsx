import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThreadCardProps } from "../../types/discover";
import ContentItemCard from "./ContentItemCard";

const ThreadCard: React.FC<ThreadCardProps> = ({ item, onPress, onFork }) => {
  return (
    <TouchableOpacity
      style={styles.threadCard}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      <Text style={styles.threadTitle}>{item.title}</Text>
      <Text style={styles.threadContent} numberOfLines={3}>
        {item.content}
      </Text>
      <Text style={styles.threadMeta}>
        {item.author} • {item.date}
      </Text>

      {/* Thread stats */}
      <View style={styles.threadStats}>
        <View style={styles.statItem}>
          <MaterialIcons name="thumb-up" size={16} color="#BBBBBB" />
          <Text style={styles.statText}>{item.likes}</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcons name="forum" size={16} color="#BBBBBB" />
          <Text style={styles.statText}>{item.comments}</Text>
        </View>
      </View>

      {/* Actions
      <View style={styles.threadActions}>
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
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => e.stopPropagation()}
          >
            <MaterialIcons name="bookmark-border" size={20} color="#BBBBBB" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => e.stopPropagation()}
          >
            <MaterialIcons name="share" size={20} color="#BBBBBB" />
          </TouchableOpacity>
        </View>
      </View> */}
      {/* Actions */}
                <ContentItemCard
                  item={item}
                  onPress={onPress}
                  toggleShareOptions={() => {}}
                  toggleCollaborationOptions={() => {}}
                />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  threadCard: {
    backgroundColor: "#2A2A36",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  threadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  threadContent: {
    fontSize: 14,
    color: "#BBBBBB",
    marginBottom: 12,
    lineHeight: 20,
  },
  threadMeta: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 12,
  },
  threadStats: {
    flexDirection: "row",
    marginBottom: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    color: "#BBBBBB",
    marginLeft: 4,
  },
  threadActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 12,
  },
  forkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498DB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  forkButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default memo(ThreadCard);
