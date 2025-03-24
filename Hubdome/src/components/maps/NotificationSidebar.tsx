import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Sample notification data
const initialNotifications = [
  {
    id: "1",
    type: "event",
    title: "Basketball Meetup",
    message: "New players have joined your event",
    time: "10 min ago",
    // image: require("../../../assets/images/basketball.png"),
    image: "sports-basketball",
  },
  {
    id: "2",
    type: "team",
    title: "Chess Team",
    message: "Your team has a new message",
    time: "1 hour ago",
    // image: require("../../../assets/images/chess.png"),
    image: "gamepad",
  },
  {
    id: "3",
    type: "event",
    title: "Hiking Adventure",
    message: "Event starts in 2 hours",
    time: "2 hours ago",
    // image: require("../../../assets/images/hiking.png"),
    image: "hiking",
  },
];

interface NotificationSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

// And add type for item in the render function
interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  image: any; // Adjust according to actual image type
}
const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isVisible, onClose }) => {
  {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState(initialNotifications);

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((notification) => notification.type === activeTab);

  const handleRemoveNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const handleMarkAllAsRead = () => {
    console.log("Mark all as read pressed");
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <View style={styles.notificationItem}>
      <Image source={item.image} style={styles.notificationImage} />
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveNotification(item.id)}
      >
        <MaterialIcons name="close" size={16} color="#BBBBBB" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIconContainer}>
        <MaterialIcons name="notifications-off" size={40} color="#BBBBBB" />
      </View>
      <Text style={styles.emptyStateTitle}>No notifications</Text>
      <Text style={styles.emptyStateMessage}>
        {activeTab === "all"
          ? "You're all caught up!"
          : `You have no ${activeTab} notifications.`}
      </Text>
    </View>
  );

  if (!isVisible) return null;

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    sidebar: {
      backgroundColor: "#2A2A36",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: "90%",
      width: "100%",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FFFFFF",
    },
    closeButton: {
      padding: 4,
    },
    tabsContainer: {
      flexDirection: "row",
      padding: 8,
      backgroundColor: "#1E1E2A",
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 4,
    },
    activeTab: {
      backgroundColor: "#3498DB",
    },
    tabText: {
      color: "#FFFFFF",
      fontWeight: "500",
    },
    activeTabText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    notificationsList: {
      flexGrow: 1,
    },
    notificationItem: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255, 255, 255, 0.1)",
    },
    notificationImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
    },
    notificationContent: {
      flex: 1,
    },
    notificationHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    notificationTitle: {
      color: "#FFFFFF",
      fontWeight: "bold",
      fontSize: 16,
    },
    notificationTime: {
      color: "#BBBBBB",
      fontSize: 12,
    },
    notificationMessage: {
      color: "#DDDDDD",
      fontSize: 14,
    },
    removeButton: {
      padding: 4,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 40,
    },
    emptyStateIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    emptyStateTitle: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
    },
    emptyStateMessage: {
      color: "#BBBBBB",
      fontSize: 16,
      textAlign: "center",
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: "rgba(255, 255, 255, 0.1)",
    },
    markAllButton: {
      backgroundColor: "#1E1E2A",
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    markAllButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
  });
  

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="chevron-right" size={24} color="#BBBBBB" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "all" && styles.activeTab]}
              onPress={() => setActiveTab("all")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "all" && styles.activeTabText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "event" && styles.activeTab]}
              onPress={() => setActiveTab("event")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "event" && styles.activeTabText,
                ]}
              >
                Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "team" && styles.activeTab]}
              onPress={() => setActiveTab("team")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "team" && styles.activeTabText,
                ]}
              >
                Teams
              </Text>
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <FlatList
            data={filteredNotifications}
            renderItem={renderNotificationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.notificationsList}
            ListEmptyComponent={renderEmptyState}
          />

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.markAllButton}
              onPress={handleMarkAllAsRead}
            >
              <Text style={styles.markAllButtonText}>Mark All as Read</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}};


export default NotificationSidebar;
