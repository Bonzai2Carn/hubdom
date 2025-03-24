// components/events/ParticipantSelector.tsx
import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ParticipantSelectorProps {
  participants: string[];
  onAddParticipant: (id: string) => void;
  onRemoveParticipant: (id: string) => void;
}

// Mock user data - in real app, fetch from API
const availableUsers = [
  { id: "user1", name: "John Doe", color: "#3498DB" },
  { id: "user2", name: "Jane Smith", color: "#9B59B6" },
  { id: "user3", name: "Bob Johnson", color: "#2ECC71" },
  { id: "user4", name: "Alice Williams", color: "#F1C40F" },
];

const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
}) => {
  const [showUserList, setShowUserList] = useState(false);

  const renderParticipant = (userId: string) => {
    const user = availableUsers.find((u) => u.id === userId);
    if (!user) return null;

    return (
      <TouchableOpacity
        key={userId}
        style={[styles.participantBubble, { backgroundColor: user.color }]}
        onPress={() => onRemoveParticipant(userId)}
      >
        <Text style={styles.participantInitial}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.selectedParticipants}>
        {participants.map((id) => renderParticipant(id))}
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowUserList(!showUserList)}
        >
          <MaterialIcons
            name="add"
            size={24}
            color="#8A56AC"
          />
        </TouchableOpacity>
      </View>

      {showUserList && (
        <View style={styles.userListContainer}>
          <FlatList
            data={availableUsers.filter(
              (user) => !participants.includes(user.id)
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => {
                  onAddParticipant(item.id);
                  setShowUserList(false);
                }}
              >
                <View
                  style={[
                    styles.userAvatar,
                    { backgroundColor: item.color },
                  ]}
                >
                  <Text style={styles.userInitial}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.userName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  selectedParticipants: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  participantBubble: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  participantInitial: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
  },
  userListContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: 4,
    padding: 8,
    maxHeight: 200,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  userInitial: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  userName: {
    fontSize: 14,
    color: "#333",
  },
});

export default ParticipantSelector;