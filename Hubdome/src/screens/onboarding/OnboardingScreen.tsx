import React, { useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Button, Surface } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch } from "../../redux/hooks";
import { joinHobby } from "../../redux/actions/hobbyActions";

// Activity category interface
interface ActivitySubcategory {
  name: string;
  venues: string;
  popularity?: number; // Add popularity field
}

interface ActivityCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  subcategories: ActivitySubcategory[];
}

// Props for OnboardingScreen
interface OnboardingScreenProps {
  navigation: StackNavigationProp<any>;
  onComplete: (selectedActivities: Record<number, string[]>) => void;
}

const { width } = Dimensions.get('window');

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation, onComplete }) => {
  // State to track selected activities
  const [selectedActivities, setSelectedActivities] = useState<Record<number, string[]>>({});
  // Loading state for button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();

  // Hard-coded activity categories with popularity data
  const activityCategories: ActivityCategory[] = [
    {
      id: 1,
      name: "Sports & Fitness",
      icon: "fitness-center",
      color: "blue",
      subcategories: [
        { name: "Running", venues: "Parks, streets, trails", popularity: 285 },
        { name: "Cycling", venues: "Roads, trails, velodromes", popularity: 194 },
        { name: "Swimming", venues: "Pools, beaches, lakes", popularity: 165 },
        { name: "Basketball", venues: "Courts, recreation centers", popularity: 248 },
        { name: "Soccer", venues: "Fields, indoor arenas", popularity: 312 },
        { name: "Tennis", venues: "Courts, sports clubs", popularity: 142 },
        { name: "Yoga", venues: "Studios, parks, home", popularity: 287 },
        { name: "Weightlifting", venues: "Gyms, home setup", popularity: 176 },
        { name: "Rock Climbing", venues: "Climbing gyms, outdoor cliffs", popularity: 127 },
        { name: "Skateboarding", venues: "Skate parks, streets", popularity: 142 },
      ],
    },
    {
      id: 2,
      name: "Creative & Visual Arts",
      icon: "brush",
      color: "purple",
      subcategories: [
        { name: "Drawing", venues: "Studios, home, classes", popularity: 213 },
        { name: "Painting", venues: "Art studios, outdoor locations", popularity: 195 },
        { name: "Sculpting", venues: "Workshops, art centers", popularity: 97 },
        { name: "Photography", venues: "Indoor/outdoor locations", popularity: 276 },
        { name: "Digital Art", venues: "Home studio, tech spaces", popularity: 189 },
        { name: "Printmaking", venues: "Print studios, workshops", popularity: 76 },
        { name: "Calligraphy", venues: "Home, workshops", popularity: 104 },
      ],
    },
    {
      id: 3,
      name: "Technology",
      icon: "laptop",
      color: "green",
      subcategories: [
        { name: "Programming", venues: "Home office, co-working spaces", popularity: 243 },
        { name: "Gaming", venues: "Home, gaming centers", popularity: 325 },
        { name: "3D Printing", venues: "Maker spaces, home workshop", popularity: 132 },
        { name: "AI/ML", venues: "Online platforms, tech labs", popularity: 186 },
        { name: "Robotics", venues: "Labs, workshops", popularity: 146 },
        { name: "Web Design", venues: "Home office, studios", popularity: 171 },
        { name: "Mobile Apps", venues: "Tech hubs, home office", popularity: 153 },
      ],
    },
    {
      id: 4,
      name: "Outdoors",
      icon: "terrain",
      color: "yellow",
      subcategories: [
        { name: "Hiking", venues: "Trails, mountains, parks", popularity: 265 },
        { name: "Camping", venues: "Campgrounds, wilderness areas", popularity: 178 },
        { name: "Fishing", venues: "Lakes, rivers, ocean", popularity: 134 },
        { name: "Gardening", venues: "Home garden, community plots", popularity: 217 },
        { name: "Bird Watching", venues: "Parks, nature reserves", popularity: 86 },
        { name: "Kayaking", venues: "Lakes, rivers, ocean", popularity: 112 },
        { name: "Mountain Biking", venues: "Trails, bike parks", popularity: 143 },
      ],
    },
    {
      id: 5,
      name: "Food & Cooking",
      icon: "restaurant",
      color: "red",
      subcategories: [
        { name: "Baking", venues: "Home kitchen, bakeries", popularity: 254 },
        { name: "Grilling", venues: "Backyard, parks", popularity: 187 },
        { name: "Wine Tasting", venues: "Wineries, tasting rooms", popularity: 163 },
        { name: "Meal Prep", venues: "Home kitchen, cooking schools", popularity: 211 },
        { name: "International Cuisine", venues: "Kitchen, cooking classes", popularity: 178 },
        { name: "Coffee Brewing", venues: "Home, coffee shops", popularity: 194 },
        { name: "Food Photography", venues: "Studio, restaurants", popularity: 113 },
      ],
    },
  ];

  // Toggle subcategory selection
  const toggleSubcategory = useCallback((categoryId: number, subcategory: string) => {
    setSelectedActivities(prev => {
      const currentSubs = prev[categoryId] || [];
      const newSubs = currentSubs.includes(subcategory)
        ? currentSubs.filter(sub => sub !== subcategory)
        : [...currentSubs, subcategory];
  
      const updated = {
        ...prev,
        [categoryId]: newSubs.length > 0 ? newSubs : []
      };
  
      // Remove empty arrays
      if (newSubs.length === 0) {
        delete updated[categoryId];
      }
  
      return updated;
    });
  }, []);
  
  // Check if any activities are selected
  const hasSelections = Object.values(selectedActivities).some(
    subs => subs?.length > 0
  );

  // Handle continue button press
  const handleContinue = async () => {
    if (!hasSelections) return;
    
    try {
      // Show loading indicator
      setIsSubmitting(true);
      
      // Prepare an array of promises for joining hobbies
      const promises: Promise<any>[] = [];
      
      // For each selected activity, create a promise to join the hobby
      Object.entries(selectedActivities).forEach(([categoryId, subcategories]) => {
        subcategories.forEach(subcategory => {
          // Create a hobby ID from category and subcategory name
          // In a real app, this would be an actual ID from your API
          const hobbyId = `${categoryId}-${subcategory.toLowerCase().replace(/\s+/g, '-')}`;
          
          // Add the promise to join this hobby
          promises.push(dispatch(joinHobby(hobbyId)));
        });
      });
      
      // Wait for all hobby join operations to complete
      await Promise.all(promises);
      
      // Call the completion callback
      onComplete(selectedActivities);
    } catch (error) {
      console.error("Error saving hobby selections:", error);
      // Show error message
      Alert.alert(
        "Error", 
        "Failed to save your hobby preferences. Please try again."
      );
    } finally {
      // Reset loading state regardless of outcome
      setIsSubmitting(false);
    }
  };

  // Generate color styles based on category color
  const getColorStyles = useCallback((color: string, isSelected: boolean) => {
    if (!isSelected) return null;

    const colorMap: Record<string, any> = {
      blue: { bg: '#EBF5FF', border: '#3498DB', text: '#3498DB' },
      purple: { bg: '#F3E8FF', border: '#9B59B6', text: '#9B59B6' },
      green: { bg: '#E6F6E6', border: '#2ECC71', text: '#2ECC71' },
      yellow: { bg: '#FEF9E7', border: '#F1C40F', text: '#F1C40F' },
      red: { bg: '#FDEDEC', border: '#E74C3C', text: '#E74C3C' },
    };

    return colorMap[color] || { bg: '#F0F0F0', border: '#BBBBBB', text: '#BBBBBB' };
  }, []);

  // Memoized Activity Category component
  const ActivityCard = memo(({ category }: { category: ActivityCategory }) => {
    const isSelected = selectedActivities[category.id]?.length > 0;
    const colorStyles = getColorStyles(category.color, isSelected);
    
    return (
      <View style={styles.categoryContainer}>
        <Surface
          style={[
            styles.categoryHeader,
            isSelected ? {
              backgroundColor: colorStyles.bg,
              borderColor: colorStyles.border
            } : null
          ]}
        >
          <View style={styles.categoryTitleContainer}>
            <MaterialIcons
              name={category.icon as any}
              size={24}
              color={isSelected ? colorStyles.text : '#BBBBBB'}
            />
            <Text
              style={[
                styles.categoryTitle,
                isSelected ? { color: colorStyles.text } : null
              ]}
            >
              {category.name}
            </Text>
          </View>
          {isSelected && (
            <Text style={styles.selectedCount}>
              {selectedActivities[category.id]?.length} selected
            </Text>
          )}
        </Surface>
        
        <View style={styles.subcategoriesGrid}>
          {category.subcategories.map(sub => (
            <TouchableOpacity
              key={sub.name}
              style={[
                styles.subcategoryItem,
                selectedActivities[category.id]?.includes(sub.name)
                  ? {
                      backgroundColor: colorStyles?.bg,
                      borderColor: colorStyles?.border
                    }
                  : null
              ]}
              onPress={() => toggleSubcategory(category.id, sub.name)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.subcategoryName,
                  selectedActivities[category.id]?.includes(sub.name)
                    ? { color: colorStyles?.text }
                    : null
                ]}
              >
                {sub.name}
              </Text>
              <Text style={styles.venuesText}>{sub.venues}</Text>
              
              {/* Popularity indicator */}
              <View style={styles.popularityContainer}>
                <MaterialIcons name="people" size={12} color="rgba(255,255,255,0.5)" />
                <Text style={styles.popularityText}>
                  {sub.popularity || Math.floor(Math.random() * 300) + 50} members
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Choose Your Favorite Activities</Text>
        <Text style={styles.headerSubtitle}>
          Select activities you enjoy to personalize your experience
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activityCategories.map(category => (
          <ActivityCard key={category.id} category={category} />
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          mode="contained"
          disabled={!hasSelections || isSubmitting}
          onPress={handleContinue}
          style={styles.continueButton}
          contentStyle={styles.buttonContent}
          loading={isSubmitting}
        >
          {isSubmitting ? "Saving..." : 
            hasSelections ? "Continue" : "Select at least one activity"}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2A',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  selectedCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  subcategoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subcategoryItem: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  subcategoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  venuesText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 6,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  popularityText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(30, 30, 42, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  continueButton: {
    borderRadius: 8,
    backgroundColor: '#3498DB',
  },
  buttonContent: {
    height: 48,
  },
});

export default OnboardingScreen;