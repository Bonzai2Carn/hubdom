import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Text,
  Modal,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Define available tools
export interface ToolbarItem {
  id: string;
  icon: string;
  label: string;
  action: () => void;
}

interface QuickAccessToolbarProps {
  defaultTools: ToolbarItem[];
  maxVisibleTools?: number;
  position?: 'left' | 'right';
}

const QuickAccessToolbar: React.FC<QuickAccessToolbarProps> = ({
  defaultTools,
  maxVisibleTools = 5,
  position = 'right'
}) => {
  const [visibleTools, setVisibleTools] = useState<ToolbarItem[]>(
    defaultTools.slice(0, maxVisibleTools)
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [toolbarAnimation] = useState(new Animated.Value(0));
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Toggle toolbar visibility with animation
  const toggleToolbar = () => {
    const nextValue = isExpanded ? 0 : 1;
    Animated.timing(toolbarAnimation, {
    toValue: nextValue,
    duration: 300,
    useNativeDriver: true,
    }).start();
  };
  
  // Open toolbar customization modal
  const openCustomization = () => {
    setIsEditMode(true);
  };
  
  // Save customized toolbar settings
  const saveCustomization = (selectedTools: ToolbarItem[]) => {
    setVisibleTools(selectedTools.slice(0, maxVisibleTools));
    setIsEditMode(false);
  };
  
  return (
    <>
      <Animated.View 
        style={[
          styles.container, 
          position === 'left' ? styles.leftContainer : styles.rightContainer,
          {
            transform: [
              { 
                translateX: toolbarAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [position === 'left' ? -100 : 100, 0]
                })
              }
            ]
          }
        ]}
      >
        {/* Toggle button */}
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={toggleToolbar}
        >
          <MaterialIcons 
           name={
            isExpanded ? position === "left"
            ? "chevron-left" : "chevron-right": position === "left"
            ? "chevron-right": "chevron-left"
            }
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        
        {/* Tool buttons */}
        {visibleTools.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.toolButton}
            onPress={tool.action}
          >
            <MaterialIcons name={tool.icon as any} size={24} color="#FFFFFF" />
            <Text style={styles.toolLabel}>{tool.label}</Text>
          </TouchableOpacity>
        ))}
        
        {/* Customize button */}
        <TouchableOpacity
          style={styles.customizeButton}
          onPress={openCustomization}
        >
          <MaterialIcons name="settings" size={20} color="#BBBBBB" />
        </TouchableOpacity>
      </Animated.View>
      
      {/* Customization Modal */}
      <Modal
        visible={isEditMode}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEditMode(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Customize Toolbar</Text>
            <Text style={styles.modalSubtitle}>
              Select up to {maxVisibleTools} tools to show in your toolbar
            </Text>
            
            <ToolSelector
              allTools={defaultTools}
              selectedTools={visibleTools}
              maxTools={maxVisibleTools}
              onSave={saveCustomization}
              onCancel={() => setIsEditMode(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

// Tool selector component for the modal
interface ToolSelectorProps {
  allTools: ToolbarItem[];
  selectedTools: ToolbarItem[];
  maxTools: number;
  onSave: (selectedTools: ToolbarItem[]) => void;
  onCancel: () => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({
  allTools,
  selectedTools,
  maxTools,
  onSave,
  onCancel
}) => {
  const [selection, setSelection] = useState<ToolbarItem[]>(selectedTools);
  
  const toggleTool = (tool: ToolbarItem) => {
    const isSelected = selection.some(t => t.id === tool.id);
    
    if (isSelected) {
      setSelection(selection.filter(t => t.id !== tool.id));
    } else {
      if (selection.length < maxTools) {
        setSelection([...selection, tool]);
      }
    }
  };
  
  return (
    <View style={styles.selectorContainer}>
      <FlatList
        data={allTools}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selection.some(t => t.id === item.id);
          
          return (
            <TouchableOpacity
              style={[styles.toolItem, isSelected && styles.selectedToolItem]}
              onPress={() => toggleTool(item)}
            >
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color={isSelected ? '#FFFFFF' : '#BBBBBB'} 
              />
              <Text style={[styles.toolItemText, isSelected && styles.selectedToolItemText]}>
                {item.label}
              </Text>
              {isSelected && (
                <MaterialIcons name="check" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          );
        }}
      />
      
      <View style={styles.modalActions}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => onSave(selection)}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    backgroundColor: 'rgba(42, 42, 54, 0.85)',
    borderRadius: 12,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  leftContainer: {
    left: 16,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  rightContainer: {
    right: 16,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
  },
  toggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(52, 152, 219, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  toolButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
  toolLabel: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  customizeButton: {
    alignSelf: 'center',
    padding: 8,
    marginTop: 8,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2A2A36',
    borderRadius: 12,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 16,
  },
  selectorContainer: {
    flex: 1,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedToolItem: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
  toolItemText: {
    flex: 1,
    marginLeft: 12,
    color: '#BBBBBB',
  },
  selectedToolItemText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    padding: 10,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#BBBBBB',
  },
  saveButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
});

export default QuickAccessToolbar;