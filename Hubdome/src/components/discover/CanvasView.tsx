// src/components/discover/CanvasView.tsx - Update to focus on hobby categories
import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  ListRenderItem,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchHobbies } from '../../redux/slices/hobbySlice';
import CreateHobbyModal from '../hobbies/CreateHobbyModal';
import {Hobby} from '../../types/interfaces';

const { width } = Dimensions.get('window');

interface CanvasViewProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  searchQuery: string;
}

// interface Hobby {
//   id: string;
//   name: string;
//   description?: string;
//   category: string;
//   memberCount?: number;
//   eventCount?: number;
// }

const CanvasView: React.FC<CanvasViewProps> = ({
  selectedCategory,
  onCategorySelect,
  searchQuery,
}) => {
  const dispatch = useAppDispatch();
  const { hobbies, loading } = useAppSelector((state) => state.hobby);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch hobbies when component mounts
  useEffect(() => {
    dispatch(fetchHobbies());
  }, [dispatch]);

  // Extract unique categories from hobbies
  const categories = useMemo(() => {
    const categoriesSet = new Set(['All']);
    hobbies.forEach(hobby => {
      if (hobby.category) {
        categoriesSet.add(hobby.category);
      }
    });
    return Array.from(categoriesSet);
  }, [hobbies]);

  // Filter hobbies based on selected category and search query
  const filteredHobbies = useMemo(() => {
    return hobbies.filter(hobby => {
      const matchesCategory = selectedCategory === 'All' || hobby.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        hobby.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (hobby.description && hobby.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [hobbies, selectedCategory, searchQuery]);

  // Group hobbies by category for visualization
  const hobbiesByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    filteredHobbies.forEach(hobby => {
      const category = hobby.category || 'Uncategorized';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(hobby);
    });
    
    return grouped;
  }, [filteredHobbies]);

  // Render category selector
  const renderCategorySelector = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categorySelectorContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategoryButton,
          ]}
          onPress={() => onCategorySelect(category)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.selectedCategoryButtonText,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
      
      <TouchableOpacity
        style={styles.createCategoryButton}
        onPress={() => setIsCreateModalOpen(true)}
      >
        <MaterialIcons name="add" size={18} color="#3498DB" />
        <Text style={styles.createCategoryButtonText}>Create Hobby</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  // Render a hobby item
  const renderHobbyItem: ListRenderItem<Hobby> = ({ item }) => (
    <TouchableOpacity 
      style={styles.hobbyItem}
      onPress={() => onHobbyPress(item)}
    >
      <View 
        style={[
          styles.hobbyItemHeader, 
          { backgroundColor: getCategoryColor(item.category) }
        ]}
      >
        <Text style={styles.hobbyName}>{item.name}</Text>
      </View>
      
      <View style={styles.hobbyStats}>
        <View style={styles.statItem}>
          <MaterialIcons name="people" size={14} color="#BBBBBB" />
          <Text style={styles.statText}>
            {item.membersCount || 0} members
          </Text>
        </View>
        
        {item.eventsCount > 0 && (
          <View style={styles.statItem}>
            <MaterialIcons name="event" size={14} color="#BBBBBB" />
            <Text style={styles.statText}>
              {item.eventsCount} events
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Get color based on category
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Physical': '#F97316',
      'Artistic': '#EC4899',
      'Musical': '#8B5CF6',
      'Tech and Gadgets': '#3B82F6',
      'Outdoor': '#10B981',
      'Culinary': '#F59E0B', 
      'DIY and Craft': '#6366F1',
      'Connection-Based': '#14B8A6',
      'Spiritual and Mindfulness': '#FB923C',
      'Collections': '#64748B',
      'Travel': '#3498DB',
      'Games and Puzzles': '#22C55E',
      'Mind': '#DB2777',
      'Health': '#06B6D4',
      'Money Making': '#0EA5E9',
    };
    
    return colors[category] || '#3498DB';
  };

  // Handle hobby item press
  const onHobbyPress = (hobby: Hobby) => {
    // Navigate to hobby detail screen
    // This should be provided by a prop in a real implementation
    console.log('Hobby pressed:', hobby);
  };

  // Render hobbies by category
  const renderCategorySection = (category: string, hobbies: any[]) => (
    <View key={category} style={styles.categorySection}>
      <Text style={styles.categoryTitle}>{category}</Text>
      
      <FlatList
        data={hobbies}
        renderItem={renderHobbyItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hobbiesContainer}
      />
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Loading hobbies...</Text>
      </View>
    );
  }

  // Empty state
  if (filteredHobbies.length === 0) {
    return (
      <View style={styles.container}>
        {renderCategorySelector()}
        
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search-off" size={64} color="rgba(255,255,255,0.2)" />
          <Text style={styles.emptyText}>No hobbies found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? "Try a different search term or category"
              : "Be the first to create a hobby in this category!"}
          </Text>
          
          <TouchableOpacity
            style={styles.createHobbyButton}
            onPress={() => setIsCreateModalOpen(true)}
          >
            <MaterialIcons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.createHobbyButtonText}>Create Hobby</Text>
          </TouchableOpacity>
        </View>
        
        <CreateHobbyModal
          isVisible={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          initialCategory={selectedCategory !== 'All' ? selectedCategory : undefined}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderCategorySelector()}
      
      <ScrollView style={styles.content}>
        {selectedCategory === 'All' ? (
          // When "All" is selected, show sections by category
          Object.entries(hobbiesByCategory).map(([category, hobbies]) => 
            renderCategorySection(category, hobbies)
          )
        ) : (
          // When specific category is selected, show a grid of hobbies
          <View style={styles.hobbyGrid}>
            {filteredHobbies.map((hobby) => (
              <TouchableOpacity
                key={hobby.id}
                style={styles.hobbyGridItem}
                onPress={() => onHobbyPress(hobby)}
              >
                <View style={styles.hobbyContent}>
                  <Text style={styles.hobbyGridName}>{hobby.name}</Text>
                  <Text style={styles.hobbyDescription} numberOfLines={2}>
                    {hobby.description}
                  </Text>
                  
                  <View style={styles.hobbyGridStats}>
                    <View style={styles.statItem}>
                      <MaterialIcons name="people" size={14} color="#BBBBBB" />
                      <Text style={styles.statText}>
                        {hobby.membersCount || 0}
                      </Text>
                    </View>
                    
                    {hobby.eventsCount > 0 && (
                      <View style={styles.statItem}>
                        <MaterialIcons name="event" size={14} color="#BBBBBB" />
                        <Text style={styles.statText}>
                          {hobby.eventsCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      
      <CreateHobbyModal
        isVisible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialCategory={selectedCategory !== 'All' ? selectedCategory : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
  },
  categorySelectorContent: {
    padding: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#3498DB',
  },
  categoryButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  createCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3498DB',
    marginRight: 8,
  },
  createCategoryButtonText: {
    color: '#3498DB',
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    padding: 16,
    paddingBottom: 8,
  },
  hobbiesContainer: {
    paddingHorizontal: 16,
  },
  hobbyItem: {
    width: 180,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  hobbyItemHeader: {
    padding: 12,
    height: 70,
    justifyContent: 'center',
  },
  hobbyName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hobbyStats: {
    flexDirection: 'row',
    padding: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    color: '#BBBBBB',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  createHobbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3498DB',
    borderRadius: 8,
  },
  createHobbyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  hobbyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
  },
  hobbyGridItem: {
    width: (width - 48) / 2,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    margin: 8,
    overflow: 'hidden',
  },
  hobbyContent: {
    padding: 12,
    flex: 1,
  },
  hobbyGridName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  hobbyDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    flex: 1,
  },
  hobbyGridStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default CanvasView;