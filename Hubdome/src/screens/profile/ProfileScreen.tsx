import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Surface,
  Text,
  Avatar,
  Title,
  Paragraph,
  Button,
  Divider,
  Dialog,
  Portal,
  List,
  Switch,
  Chip,
} from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logoutUser } from "../../redux/actions/authActions";

import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/native";

export type ScreenNavigationProp = StackNavigationProp<ParamListBase>;

interface ScreenProps {
  navigation: ScreenNavigationProp;
}

const ProfileScreen: React.FC<ScreenProps> = ({ navigation }) => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("hobbies");

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.userInfo);

  // Custom theme colors based on our brand identity
  const colors = {
    primary: "#3498DB", // Vibrant Blue
    accent: "#FF7F50", // Energetic Coral
    background: "#1E1E2A", // Dark background
    surface: "#2A2A36", // Slightly lighter surface
    text: "#FFFFFF", // White text
    textSecondary: "rgba(255,255,255,0.7)",
    border: "rgba(255,255,255,0.1)",
  };

  // Mock user hobbies data
  const userHobbies = [
    { id: "1", name: "Photography", level: "Intermediate", color: "#F97316" },
    { id: "2", name: "Hiking", level: "Advanced", color: "#3B82F6" },
    { id: "3", name: "Cooking", level: "Beginner", color: "#EF4444" },
  ];

  // Mock user event data
  const userEvents = [
    {
      id: "1",
      title: "Photography Workshop",
      date: "2025-03-15T14:00:00Z",
      location: "San Francisco, CA",
      isOrganizer: true,
    },
    {
      id: "2",
      title: "Hiking Trip",
      date: "2025-03-22T10:00:00Z",
      location: "Yosemite, CA",
      isOrganizer: false,
    },
    {
      id: "3",
      title: "Cooking Class",
      date: "2025-04-05T18:00:00Z",
      location: "Online",
      isOrganizer: false,
    },
  ];

  // Mock user settings
  const [settings, setSettings] = useState({
    notifications: true,
    locationSharing: true,
    darkMode: true,
    emailUpdates: false,
  });

  const handleLogout = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    dispatch(logoutUser());
    setShowLogoutDialog(false);
  };

  // Format date string
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        {/* Profile Header */}
        <Surface
          style={[styles.headerContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.headerContent}>
            <Avatar.Text
              size={80}
              label={user?.name?.charAt(0) || "U"}
              style={{ backgroundColor: colors.primary }}
            />
            <View style={styles.userInfo}>
              <Title style={{ color: colors.text }}>
                {user?.name || "User"}
              </Title>
              <Paragraph style={{ color: colors.textSecondary }}>
                {user?.email || ""}
              </Paragraph>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Hobbies</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>47</Text>
              <Text style={styles.statLabel}>Friends</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <Button
              mode="contained"
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate("EditProfile")}
            >
              Edit Profile
            </Button>
            <Button
              mode="outlined"
              style={styles.actionButton}
              textColor={colors.accent}
              onPress={handleLogout}
            >
              Logout
            </Button>
          </View>
        </Surface>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "hobbies" && [
                styles.activeTab,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab("hobbies")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "hobbies" && { color: colors.primary },
              ]}
            >
              Hobbies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "events" && [
                styles.activeTab,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab("events")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "events" && { color: colors.primary },
              ]}
            >
              Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "settings" && [
                styles.activeTab,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab("settings")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "settings" && { color: colors.primary },
              ]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "hobbies" && (
          <Surface
            style={[
              styles.contentContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Hobbies</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("CreateHobby")}
              >
                <MaterialIcons name="add" size={20} color={colors.primary} />
                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  Add New
                </Text>
              </TouchableOpacity>
            </View>

            {userHobbies.map((hobby) => (
              <View key={hobby.id} style={styles.hobbyCard}>
                <View
                  style={[
                    styles.hobbyColorBar,
                    { backgroundColor: hobby.color },
                  ]}
                />
                <View style={styles.hobbyContent}>
                  <View>
                    <Text style={styles.hobbyName}>{hobby.name}</Text>
                    <Chip style={styles.levelChip} textStyle={{ fontSize: 12 }}>
                      {hobby.level}
                    </Chip>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={colors.textSecondary}
                  />
                </View>
              </View>
            ))}
          </Surface>
        )}

        {activeTab === "events" && (
          <Surface
            style={[
              styles.contentContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Events</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("CreateEvent")}
              >
                <MaterialIcons name="add" size={20} color={colors.primary} />
                <Text style={[styles.addButtonText, { color: colors.primary }]}>
                  Add New
                </Text>
              </TouchableOpacity>
            </View>

            {userEvents.map((event) => (
              <View key={event.id} style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  {event.isOrganizer && (
                    <Chip
                      style={styles.organizerChip}
                      textStyle={{ fontSize: 12, color: "white" }}
                    >
                      Organizer
                    </Chip>
                  )}
                </View>
                <View style={styles.eventDetails}>
                  <View style={styles.eventDetail}>
                    <MaterialIcons
                      name="event"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.eventDetailText}>
                      {formatDate(event.date)}
                    </Text>
                  </View>
                  <View style={styles.eventDetail}>
                    <MaterialIcons
                      name="location-on"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.eventDetailText}>{event.location}</Text>
                  </View>
                </View>
              </View>
            ))}
          </Surface>
        )}

        {activeTab === "settings" && (
          <Surface
            style={[
              styles.contentContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={styles.sectionTitle}>App Settings</Text>

            <List.Item
              title="Notifications"
              description="Receive push notifications"
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
              right={() => (
                <Switch
                  value={settings.notifications}
                  onValueChange={() =>
                    setSettings({
                      ...settings,
                      notifications: !settings.notifications,
                    })
                  }
                  color={colors.primary}
                />
              )}
            />
            <Divider style={{ backgroundColor: colors.border }} />

            <List.Item
              title="Location Sharing"
              description="Allow others to see your location"
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
              right={() => (
                <Switch
                  value={settings.locationSharing}
                  onValueChange={() =>
                    setSettings({
                      ...settings,
                      locationSharing: !settings.locationSharing,
                    })
                  }
                  color={colors.primary}
                />
              )}
            />
            <Divider style={{ backgroundColor: colors.border }} />

            <List.Item
              title="Dark Mode"
              description="Use dark theme"
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
              right={() => (
                <Switch
                  value={settings.darkMode}
                  onValueChange={() =>
                    setSettings({ ...settings, darkMode: !settings.darkMode })
                  }
                  color={colors.primary}
                />
              )}
            />
            <Divider style={{ backgroundColor: colors.border }} />

            <List.Item
              title="Email Updates"
              description="Receive email about events and updates"
              titleStyle={{ color: colors.text }}
              descriptionStyle={{ color: colors.textSecondary }}
              right={() => (
                <Switch
                  value={settings.emailUpdates}
                  onValueChange={() =>
                    setSettings({
                      ...settings,
                      emailUpdates: !settings.emailUpdates,
                    })
                  }
                  color={colors.primary}
                />
              )}
            />
            <Divider style={{ backgroundColor: colors.border }} />

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={24} color="#E74C3C" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </Surface>
        )}
      </ScrollView>

      {/* Logout Dialog */}
      <Portal>
        <Dialog
          visible={showLogoutDialog}
          onDismiss={() => setShowLogoutDialog(false)}
          style={{ backgroundColor: colors.surface }}
        >
          <Dialog.Title style={{ color: colors.text }}>Logout</Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: colors.textSecondary }}>
              Are you sure you want to logout?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLogoutDialog(false)}>Cancel</Button>
            <Button onPress={confirmLogout} textColor="#E74C3C">
              Logout
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    marginLeft: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderColor: "#FF7F50",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#2A2A36",
    paddingVertical: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
  },
  contentContainer: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  addButtonText: {
    marginLeft: 4,
    fontWeight: "500",
  },
  hobbyCard: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    overflow: "hidden",
  },
  hobbyColorBar: {
    width: 6,
  },
  hobbyContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  hobbyName: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginBottom: 4,
  },
  levelChip: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  eventCard: {
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: 12,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  organizerChip: {
    backgroundColor: "#FF7F50",
  },
  eventDetails: {
    marginTop: 4,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eventDetailText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(231, 76, 60, 0.15)",
    borderRadius: 8,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#E74C3C",
  },
});

export default ProfileScreen;

// "use client";
// import React from "react";

// function MainComponent() {
//   const [activeTab, setActiveTab] = useState("all");
//   const [modalOpen, setModalOpen] = useState(false);
//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       title: "Photography Workshop",
//       category: "arts",
//       type: "event",
//       image: "/images/photography.jpg",
//       date: "Tomorrow, 2:00 PM",
//       participants: 12,
//       location: "Downtown Studio",
//     },
//     {
//       id: 2,
//       title: "Chess Tournament",
//       category: "games",
//       type: "event",
//       image: "/images/chess.jpg",
//       date: "This Saturday",
//       participants: 24,
//       location: "Community Center",
//     },
//     {
//       id: 3,
//       title: "Latest Pottery Trends",
//       category: "arts",
//       type: "news",
//       image: "/images/pottery.jpg",
//       readTime: "5 min read",
//       source: "Hobby Weekly",
//     },
//     {
//       id: 4,
//       title: "Gardening Tips for Spring",
//       category: "outdoors",
//       type: "news",
//       image: "/images/gardening.jpg",
//       readTime: "3 min read",
//       source: "Green Thumb Magazine",
//     },
//   ]);

//   const tabs = [
//     { id: "all", label: "All", icon: "fa-th-large" },
//     { id: "arts", label: "Arts", icon: "fa-palette" },
//     { id: "games", label: "Games", icon: "fa-chess" },
//     { id: "outdoors", label: "Outdoors", icon: "fa-mountain" },
//   ];

//   const filteredEvents =
//     activeTab === "all"
//       ? events
//       : events.filter((event) => event.category === activeTab);

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
//       <div className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10">
//         <div className="max-w-[600px] mx-auto px-4">
//           <HeaderIcons
//             onProfileClick={() => (window.location.href = "/profile")}
//             onNotificationsClick={() =>
//               (window.location.href = "/notifications")
//             }
//           />

//           <div className="flex overflow-x-auto py-4 gap-4 no-scrollbar">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors
//                   ${
//                     activeTab === tab.id
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
//                   }`}
//               >
//                 <i className={`fas ${tab.icon}`}></i>
//                 <span className="font-inter">{tab.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-[600px] mx-auto p-4 space-y-6">
//         {filteredEvents.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
//           >
//             <img
//               src={item.image}
//               alt={item.title}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-4">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="font-inter font-semibold text-gray-900 dark:text-white">
//                     {item.title}
//                   </h3>
//                   {item.type === "event" ? (
//                     <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 space-y-1 font-inter">
//                       <p>
//                         <i className="fas fa-calendar-alt mr-2"></i>
//                         {item.date}
//                       </p>
//                       <p>
//                         <i className="fas fa-map-marker-alt mr-2"></i>
//                         {item.location}
//                       </p>
//                       <p>
//                         <i className="fas fa-users mr-2"></i>
//                         {item.participants} participants
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-inter">
//                       <p>
//                         <i className="fas fa-clock mr-2"></i>
//                         {item.readTime}
//                       </p>
//                       <p>
//                         <i className="fas fa-newspaper mr-2"></i>
//                         {item.source}
//                       </p>
//                     </div>
//                   )}
//                 </div>
//                 <button
//                   className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
//                   onClick={() =>
//                     item.type === "event" ? setModalOpen(true) : null
//                   }
//                 >
//                   <i
//                     className={`fas fa-${
//                       item.type === "event" ? "arrow-right" : "bookmark"
//                     } text-xl`}
//                   ></i>
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <BottomNav
//         activePage="/discover"
//         onPageChange={(path) => (window.location.href = path)}
//         onCreateClick={() => setModalOpen(true)}
//       />

//       <CreateEventModal
//         isOpen={modalOpen}
//         onClose={() => setModalOpen(false)}
//         onSubmit={async (data) => {
//           try {
//             const response = await fetch("/api/events", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(data),
//             });
//             if (!response.ok) {
//               throw new Error(`Error: ${response.status}`);
//             }
//             setModalOpen(false);
//           } catch (error) {
//             console.error("Failed to create event:", error);
//           }
//         }}
//       />
//     </div>
//   );
// }

// export default MainComponent;