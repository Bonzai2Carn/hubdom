// src/components/hobbies/CreateHobbyModal.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Chip } from 'react-native-paper';
import { useAppDispatch } from '../../redux/hooks';
import { createHobby } from '../../redux/actions/hobbyActions';

interface CreateHobbyModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialCategory?: string;
}

const CATEGORIES = [
  "artistic", 
  "outdoor", 
  "physical", 
  "musical", 
  "tech-and-gadgets",
  "culinary", 
  "diy-and-craft", 
  "connection-based", 
  "spiritual-and-mindfulness",
  "scientific-and-intellectual", 
  "games-and-puzzles", 
  "collecting",
  "travel", 
  "mind", 
  "health", 
  "business",
  "other",
];

const CreateHobbyModal: React.FC<CreateHobbyModalProps> = ({
  isVisible,
  onClose,
  initialCategory,
}) => {
  const dispatch = useAppDispatch();
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(initialCategory || '');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form on close
  const handleClose = () => {
    setName('');
    setDescription('');
    setCategory(initialCategory || '');
    setTags([]);
    setCurrentTag('');
    setIsSubmitting(false);
    onClose();
  };

  // Add tag 
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a hobby name');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please add a description');
      return;
    }
    
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create hobby
      await dispatch(createHobby({
        name,
        description,
        category,
        tags: tags.length > 0 ? tags : undefined,
      })).unwrap();
      
      // Show success message
      Alert.alert(
        'Success', 
        'Your hobby has been published! All users will be notified.',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      console.error('Error creating hobby:', error);
      Alert.alert(
        'Error',
        typeof error === 'string' 
          ? error 
          : 'Failed to create hobby. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Hobby</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#BBBBBB" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {/* Hobby Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Hobby Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter hobby name"
                placeholderTextColor="#BBBBBB"
              />
            </View>

            {/* Description */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe this hobby (activities, benefits, etc.)"
                placeholderTextColor="#BBBBBB"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Category */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriesContainer}>
                  {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryButton,
                        category === cat && styles.selectedCategoryButton,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryButtonText,
                          category === cat && styles.selectedCategoryButtonText,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Tags */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tags (Optional)</Text>
              <View style={styles.tagInputContainer}>
                <TextInput
                  style={styles.tagInput}
                  value={currentTag}
                  onChangeText={setCurrentTag}
                  placeholder="Add tag"
                  placeholderTextColor="#BBBBBB"
                  onSubmitEditing={addTag}
                />
                <TouchableOpacity 
                  style={styles.addTagButton}
                  onPress={addTag}
                  disabled={!currentTag.trim()}
                >
                  <MaterialIcons 
                    name="add" 
                    size={24} 
                    color={currentTag.trim() ? "#3498DB" : "#BBBBBB"} 
                  />
                </TouchableOpacity>
              </View>
              
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      style={styles.tagChip}
                      onClose={() => removeTag(tag)}
                    >
                      {tag}
                    </Chip>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!name || !description || !category || isSubmitting) 
                  ? styles.disabledButton 
                  : {}
              ]}
              onPress={handleSubmit}
              disabled={!name || !description || !category || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Publish Hobby</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#2A2A36',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
    maxHeight: '70%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#BBBBBB',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1E1E2A',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
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
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#1E1E2A',
    color: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addTagButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tagChip: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    margin: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#BBBBBB',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.5)',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CreateHobbyModal;