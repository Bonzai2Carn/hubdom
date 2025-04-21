import React, { memo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AudioCardProps } from "../../types/discover";
import ContentItemCard from "./ContentItemCard";

const AudioCard: React.FC<AudioCardProps> = ({ item, onPress, onFork }) => {
  return (
    <TouchableOpacity
      style={styles.audioCard}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      {/* Audio thumbnail */}
      <View style={styles.audioThumbnail}>
        <MaterialIcons name="headset" size={32} color="#3498DB" />
      </View>

      {/* Audio info */}
      <View style={styles.audioContent}>
        <Text style={styles.audioTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.audioDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.audioMeta}>
          {item.author} • {item.date}
        </Text>

        {/* Audio progress */}
        <View style={styles.audioProgress}>
          <TouchableOpacity onPress={(e) => e.stopPropagation()}>
            <MaterialIcons name="play-arrow" size={20} color="#3498DB" />
          </TouchableOpacity>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.audioDuration}>24:35</Text>
        </View>

        {/* Actions */}
        <View style={styles.audioActionContent}>
          <ContentItemCard
            item={item}
            onPress={onPress}
            toggleShareOptions={() => {}}
            toggleCollaborationOptions={() => {}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  audioCard: {
    flexDirection: "row",
    backgroundColor: "#2A2A36",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  audioThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#1E1E2A",
    justifyContent: "center",
    alignItems: "center",
  },
  audioActionContent: {
    justifyContent: "space-between",
    alignItems: "flex-start", 
  },
  audioContent: {
    flex: 1,
    marginLeft: 12,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  audioDescription: {
    fontSize: 14,
    color: "#BBBBBB",
    marginBottom: 4,
  },
  audioMeta: {
    fontSize: 12,
    color: "#AAAAAA",
    marginBottom: 8,
  },
  audioProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: "#444444",
    borderRadius: 2,
    marginHorizontal: 8,
  },
  progressFill: {
    width: "30%", // Example progress
    height: 3,
    backgroundColor: "#3498DB",
    borderRadius: 2,
  },
  audioDuration: {
    fontSize: 12,
    color: "#BBBBBB",
    
  },
  audioActions: {
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

export default memo(AudioCard);
