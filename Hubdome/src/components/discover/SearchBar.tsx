import React, { memo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { SearchBarProps } from "../../types/discover";

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  onCancel,
}) => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color="#BBBBBB" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search content..."
          placeholderTextColor="#BBBBBB"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoFocus
        />
        {searchQuery !== "" && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialIcons name="close" size={20} color="#BBBBBB" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#2A2A36",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E2A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 0,
  },
  cancelButton: {
    marginLeft: 8,
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    color: "#3498DB",
    fontSize: 16,
  },
});

export default memo(SearchBar);
