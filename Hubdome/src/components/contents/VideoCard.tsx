import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { VideoCardProps } from "../../types/discover";
import ContentItemCard from "./ContentItemCard";

const VideoCard: React.FC<VideoCardProps> = ({ item, onPress, onFork }) => {
  return (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      {/* Video thumbnail */}
      <View style={styles.videoThumbnail}>
        <MaterialIcons
          name="play-circle-outline"
          size={48}
          color="#FFFFFF"
          style={styles.playIcon}
        />
      </View>

      {/* Video info overlay */}
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        {/* <Text style={styles.videoAuthor}>
          {item.author} • {item.date}
        </Text>
        <View style={styles.videoActions}>
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
              <MaterialIcons name="bookmark-border" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={(e) => e.stopPropagation()}
            >
              <MaterialIcons name="share" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View> */}

        <ContentItemCard
                    item={item}
                    onPress={onPress}
                    toggleShareOptions={() => {}}
                    toggleCollaborationOptions={() => {}}
                  />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  videoCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#2A2A36",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  videoThumbnail: {
    height: 400,
    backgroundColor: "#1E1E2A",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    opacity: 0.8,
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  videoAuthor: {
    fontSize: 14,
    color: "#BBBBBB",
    marginBottom: 12,
  },
  videoActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

export default memo(VideoCard);
