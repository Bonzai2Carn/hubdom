import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";
import { getAllHobbies } from "../../redux/actions/hobbyActions";
import { NavigationProp } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../redux/store'; // Adjust path as needed
import { useAppSelector } from '../../redux/hooks';

interface ProfileSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  navigation: NavigationProp<any>;
}

// Add type for your Redux state if not already defined
interface UserState {
  userInfo: {
    name?: string;
    email?: string;
    avatar?: string;
  };
}

interface HobbyState {
  hobbies: any[];
  loading: boolean;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isVisible, onClose, navigation }) => {
  const dispatch = useDispatch<AppDispatch>(); // Add AppDispatch type from your store
  const user = useSelector((state: RootState) => state.user.userInfo);
  // const { hobbies } = useAppSelector((state) => state.hobby);
  const { hobbies, loading: hobbiesLoading } = useSelector((state: RootState) => state.hobby);
  
  // Local state
  const [activeSection, setActiveSection] = useState("hobbies");
  
  // Mocked user hobbies data for now - will be replaced with API data
  const [userHobbies, setUserHobbies] = useState([
    {
      id: "1",
      name: "Photography",
      level: "Intermediate",
      color: "#F97316",
      participants: 24,
      events: 3,
    },
  ]);

  // Mocked user participation in events
  const [userParticipations, setUserParticipations] = useState([
    {
      id: "1",
      name: "Photography Workshop",
      type: "Public",
      date: "Mar 15, 2025",
      members: 8,
      isCreator: true,
    },
    {
      id: "2",
      name: "Hiking Adventure",
      type: "Private",
      date: "Mar 22, 2025",
      members: 5,
      isCreator: false,
    },
    {
      id: "3",
      name: "Solo Cooking Practice",
      type: "Solo",
      date: "Apr 5, 2025",
      members: 1,
      isCreator: true,
    },
  ]);

  // Fetch hobbies on mount
  useEffect(() => {
    if (isVisible) {
      dispatch(getAllHobbies());
    }
  }, [isVisible, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
  };

  // Navigate to hobby detail screen
  const navigateToHobby = (hobbyId: string) => {
    onClose();
    navigation.navigate("HobbyDetail", { hobbyId });
  };

  // Navigate to chat screen (to be implemented)
  const navigateToChat = (eventId: string) => {
    onClose();
    // Placeholder: Will navigate to chat screen when implemented
    console.log(`Navigate to chat for event: ${eventId}`);
  };

  const renderHobbiesSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionDescription}>
        Your favorite hobbies decide what appears on your Discover page
      </Text>
      
      {hobbiesLoading ? (
        <ActivityIndicator size="small" color="#3498DB" style={styles.loader} />
      ) : (
        <View style={styles.hobbiesGrid}>
          {userHobbies.map((hobby) => (
            <TouchableOpacity
              key={hobby.id}
              style={[styles.hobbyItem, { borderLeftColor: hobby.color }]}
              onPress={() => navigateToHobby(hobby.id)}
            >
              <Text style={styles.hobbyName}>{hobby.name}</Text>
              <View style={styles.hobbyDetails}>
                <Text style={styles.hobbyLevel}>{hobby.level}</Text>
                <View style={styles.hobbyStats}>
                  <View style={styles.statItem}>
                    <MaterialIcons name="people" size={14} color="#BBBBBB" />
                    <Text style={styles.statText}>{hobby.participants}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <MaterialIcons name="event" size={14} color="#BBBBBB" />
                    <Text style={styles.statText}>{hobby.events}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.addHobbyButton}
        onPress={() => navigation.navigate("CreateHobby")}
      >
        <MaterialIcons name="add" size={18} color="#3498DB" />
        <Text style={styles.addHobbyText}>Add New Hobby</Text>
      </TouchableOpacity>
    </View>
  );

  const renderParticipatesSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionDescription}>
        Events you've created or joined
      </Text>
      
      <View style={styles.participationList}>
        {userParticipations.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventItem}
            onPress={() => navigateToChat(event.id)}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventName}>{event.name}</Text>
              <View 
                style={[
                  styles.eventTypeTag, 
                  { 
                    backgroundColor: 
                      event.type === "Public" ? "#3498DB" : 
                      event.type === "Private" ? "#9B59B6" : 
                      "#E67E22" 
                  }
                ]}
              >
                <Text style={styles.eventTypeText}>{event.type}</Text>
              </View>
            </View>
            
            <View style={styles.eventDetails}>
              <View style={styles.eventDetail}>
                <MaterialIcons name="calendar-today" size={14} color="#BBBBBB" />
                <Text style={styles.eventDetailText}>{event.date}</Text>
              </View>
              
              <View style={styles.eventDetail}>
                <MaterialIcons name="people" size={14} color="#BBBBBB" />
                <Text style={styles.eventDetailText}>
                  {event.members} {event.members === 1 ? "member" : "members"}
                </Text>
              </View>
            </View>
            
            {event.isCreator && (
              <View style={styles.creatorBadge}>
                <MaterialIcons name="star" size={12} color="#FFD700" />
                <Text style={styles.creatorText}>Creator</Text>
              </View>
            )}
            
            <MaterialIcons 
              name="chat" 
              size={22} 
              color="#3498DB" 
              style={styles.chatIcon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAccountSection = () => (
    <View style={styles.sectionContent}>
      <Text style={styles.sectionDescription}>
        Account settings and preferences
      </Text>
      
      {/* Placeholder for account settings */}
      <View style={styles.settingsPlaceholder}>
        <MaterialIcons name="settings" size={48} color="#BBBBBB" />
        <Text style={styles.placeholderText}>
          Account settings will be available soon
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sidebar}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="chevron-right" size={24} color="#BBBBBB" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.profileImageContainer}>
              <TouchableOpacity style={styles.editProfileButton}>
                <MaterialIcons name="edit" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{user?.name || "User"}</Text>
            <Text style={styles.profileUsername}>{user?.email || "@username"}</Text>
          </View>

          <View style={styles.divider} />
          {/* Section Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeSection === "hobbies" && styles.activeTab]} 
              onPress={() => setActiveSection("hobbies")}
            >
              <MaterialIcons 
                name="favorite" 
                size={20} 
                color={activeSection === "hobbies" ? "#3498DB" : "#BBBBBB"} 
              />
              <Text style={[styles.tabText, activeSection === "hobbies" && styles.activeTabText]}>
                Hobbies
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeSection === "participates" && styles.activeTab]} 
              onPress={() => setActiveSection("participates")}
            >
              <MaterialIcons 
                name="groups" 
                size={20} 
                color={activeSection === "participates" ? "#3498DB" : "#BBBBBB"} 
              />
              <Text style={[styles.tabText, activeSection === "participates" && styles.activeTabText]}>
                Participates
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeSection === "account" && styles.activeTab]} 
              onPress={() => setActiveSection("account")}
            >
              <MaterialIcons 
                name="person" 
                size={20} 
                color={activeSection === "account" ? "#3498DB" : "#BBBBBB"} 
              />
              <Text style={[styles.tabText, activeSection === "account" && styles.activeTabText]}>
                Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content based on active section */}
          <ScrollView style={styles.content}>
            {activeSection === "hobbies" && renderHobbiesSection()}
            {activeSection === "participates" && renderParticipatesSection()}
            {activeSection === "account" && renderAccountSection()}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <MaterialIcons
                name="logout"
                size={20}
                color="#E74C3C"
                style={styles.menuIcon}
              />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
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
  profileInfo: {
    alignItems: "center",
    padding: 24,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3498DB",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2A2A36",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: "#BBBBBB",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498DB",
  },
  tabText: {
    color: "#BBBBBB",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#3498DB",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  sectionContent: {
    padding: 16,
  },
  sectionDescription: {
    color: "#BBBBBB",
    fontSize: 14,
    marginBottom: 16,
    fontStyle: "italic",
  },
  hobbiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  hobbyItem: {
    width: "48%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  hobbyName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  hobbyDetails: {
    justifyContent: "space-between",
  },
  hobbyLevel: {
    color: "#BBBBBB",
    fontSize: 12,
    marginBottom: 6,
  },
  hobbyStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  statText: {
    color: "#BBBBBB",
    fontSize: 12,
    marginLeft: 4,
  },
  addHobbyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  addHobbyText: {
    color: "#3498DB",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  participationList: {
    marginTop: 8,
  },
  eventItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    position: "relative",
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  eventName: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
  },
  eventTypeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  eventTypeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  eventDetails: {
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  eventDetailText: {
    color: "#BBBBBB",
    fontSize: 12,
    marginLeft: 6,
  },
  creatorBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  creatorText: {
    color: "#FFD700",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "500",
  },
  chatIcon: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },
  settingsPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  placeholderText: {
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "rgba(231, 76, 60, 0.15)",
    borderRadius: 8,
  },
  menuIcon: {
    marginRight: 8,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#E74C3C",
  },
  loader: {
    marginVertical: 20,
  }
});

export default ProfileSidebar;