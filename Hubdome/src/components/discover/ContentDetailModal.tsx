import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ContentDetailModalProps, ContentItem } from "../../types/discover";

const { width, height } = Dimensions.get("window");

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  visible,
  item,
  onClose,
  onFork,
}) => {
  if (!visible || !item) return null;

  // Get icon based on content type
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "video":
        return "videocam";
      case "audio":
        return "headset";
      case "thread":
      default:
        return "forum";
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <MaterialIcons name="close" size={24} color="#BBBBBB" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView style={styles.scrollContent}>
                {/* Preview based on content type */}
                {item.type === "video" && (
                  <View style={styles.videoPreview}>
                    <View style={styles.videoPlaceholder}>
                      <MaterialIcons
                        name="play-circle-outline"
                        size={64}
                        color="#FFFFFF"
                      />
                    </View>
                  </View>
                )}

                {item.type === "audio" && (
                  <View style={styles.audioPlayer}>
                    <View style={styles.audioControls}>
                      <TouchableOpacity style={styles.playButton}>
                        <MaterialIcons
                          name="play-arrow"
                          size={32}
                          color="#3498DB"
                        />
                      </TouchableOpacity>
                      <View style={styles.audioProgressBar}>
                        <View style={[styles.progressFill, { width: "30%" }]} />
                      </View>
                      <Text style={styles.audioDuration}>24:35</Text>
                    </View>
                  </View>
                )}

                {/* Content metadata */}
                <View style={styles.metadataContainer}>
                  <Text style={styles.authorText}>
                    {item.author} • {item.date}
                  </Text>

                  {item.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}

                  {item.content && (
                    <Text style={styles.content}>{item.content}</Text>
                  )}

                  {/* Stats */}
                  <View style={styles.statsContainer}>
                    {item.likes !== undefined && (
                      <View style={styles.statItem}>
                        <MaterialIcons
                          name="thumb-up"
                          size={16}
                          color="#BBBBBB"
                        />
                        <Text style={styles.statValue}>{item.likes}</Text>
                      </View>
                    )}

                    {item.comments !== undefined && (
                      <View style={styles.statItem}>
                        <MaterialIcons
                          name="comment"
                          size={16}
                          color="#BBBBBB"
                        />
                        <Text style={styles.statValue}>{item.comments}</Text>
                      </View>
                    )}

                    <View style={styles.statItem}>
                      <MaterialIcons
                        name="call-split"
                        size={16}
                        color="#BBBBBB"
                      />
                      <Text style={styles.statValue}>{item.forks}</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Footer with actions */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.forkButton}
                  onPress={() => {
                    onFork(item);
                    onClose();
                  }}
                >
                  <MaterialIcons name="call-split" size={20} color="#FFFFFF" />
                  <Text style={styles.forkButtonText}>Fork Content</Text>
                </TouchableOpacity>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons
                      name="bookmark-border"
                      size={24}
                      color="#BBBBBB"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialIcons name="share" size={24} color="#BBBBBB" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    backgroundColor: "#2A2A36",
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginRight: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    maxHeight: height * 0.5,
  },
  videoPreview: {
    height: 200,
    backgroundColor: "#1E1E2A",
    justifyContent: "center",
    alignItems: "center",
  },
  videoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(52, 152, 219, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  audioPlayer: {
    backgroundColor: "#1E1E2A",
    padding: 16,
  },
  audioControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  audioProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#444444",
    borderRadius: 3,
    marginHorizontal: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3498DB",
    borderRadius: 3,
  },
  audioDuration: {
    fontSize: 14,
    color: "#BBBBBB",
  },
  metadataContainer: {
    padding: 16,
  },
  authorText: {
    fontSize: 14,
    color: "#AAAAAA",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 12,
    lineHeight: 22,
  },
  content: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statValue: {
    marginLeft: 6,
    fontSize: 14,
    color: "#BBBBBB",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  forkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3498DB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  forkButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});

export default memo(ContentDetailModal);
