import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StickyNoteProps } from "../../types/discover";

const StickyNote: React.FC<StickyNoteProps> = ({
  item,
  position,
  rotationAngle = 0,
  isHighlighted = false,
  onPress,
}) => {
  // Calculate background color based on importance
  const backgroundColor = useMemo(() => {
    switch (item.importance) {
      case "high":
        return "rgba(255, 153, 153, 0.9)";
      case "medium":
        return "rgba(255, 237, 74, 0.9)";
      case "low":
      default:
        return "rgba(255, 248, 220, 0.9)";
    }
  }, [item.importance]);

  // Get icon based on content type
  const getTypeIcon = (type: string)/*: string*/ => {
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
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: position.x },
            { translateY: position.y },
            { rotate: `${rotationAngle}deg` },
          ],
          backgroundColor,
          borderWidth: isHighlighted ? 2 : 0,
          borderColor: isHighlighted ? "#3498DB" : "transparent",
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={() => onPress(item)}
        activeOpacity={0.8}
      >
        {/* Type icon */}
        <View style={styles.typeIcon}>
          <MaterialIcons
            name={getTypeIcon(item.type)}
            size={12}
            color="#555555"
          />
        </View>

        {/* Content */}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {item.author}
        </Text>

        {/* Footer with forks count */}
        <View style={styles.footer}>
          <Text style={styles.forkCount}>{item.forks}</Text>
          <MaterialIcons name="call-split" size={12} color="#666666" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 140,
    height: 140,
    padding: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  typeIcon: {
    alignSelf: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  forkCount: {
    fontSize: 12,
    color: "#666666",
    marginRight: 4,
  },
});

export default memo(StickyNote);
