// components/events/CategorySelector.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = [
    { id: "designing", name: "Designing" },
    { id: "development", name: "Development" },
    { id: "marketing", name: "Marketing" },
    { id: "research", name: "Research" },
  ];

  const selectedCategoryName = 
    categories.find(cat => cat.id === selectedCategory)?.name || "Select Category";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.selectText}>{selectedCategoryName}</Text>
        <MaterialIcons
          name={isDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color="#8A8A8A"
        />
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdown}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.dropdownItem,
                selectedCategory === category.id && styles.selectedItem,
              ]}
              onPress={() => {
                onSelectCategory(category.id);
                setIsDropdownOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedCategory === category.id && styles.selectedItemText,
                ]}
              >
                {category.name}
              </Text>
              {selectedCategory === category.id && (
                <MaterialIcons name="check" size={18} color="#8A56AC" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  selectButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F0FF",
    borderRadius: 8,
    padding: 12,
  },
  selectText: {
    fontSize: 16,
    color: "#333",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: 4,
    padding: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 6,
  },
  selectedItem: {
    backgroundColor: "#F0F0FF",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
  selectedItemText: {
    color: "#8A56AC",
    fontWeight: "500",
  },
});

export default CategorySelector;