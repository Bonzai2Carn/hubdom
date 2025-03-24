// mobile/src/components/bars/EventSearchBar.tsx
import React, { memo } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

// Define SearchBarProps properly
interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
}

const EventSearchBar: React.FC<SearchBarProps> = ({ searchQuery, onChangeText }) => {
  return (
    <Searchbar
      placeholder="Search events"
      onChangeText={onChangeText}
      value={searchQuery}
      style={styles.searchBar}
      iconColor="#3498DB"
      placeholderTextColor="rgba(255,255,255,0.5)"
      inputStyle={{ color: "#FFFFFF" }}
      theme={{ colors: { surface: "#2A2A36" } }}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    elevation: 0,
    borderRadius: 8,
  },
});

export default memo(EventSearchBar);