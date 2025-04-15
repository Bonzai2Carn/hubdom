// src/screens/onboarding/AvatarSelection.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../utils/theme';

interface AvatarSelectionProps {
  selectedAvatar: string;
  onSelectAvatar: (avatar: string) => void;
  displayName: string;
  onUpdateDisplayName: (name: string) => void;
}

const AVATAR_TYPES = [
  { id: 'Competitor', icon: 'directions-run', color: '#F97316' },
  { id: 'Visionary', icon: 'visibility', color: '#3B82F6' },
  { id: 'Maestro', icon: 'music-note', color: '#EC4899' },
  { id: 'Strategist', icon: 'psychology', color: '#8B5CF6' },
  { id: 'Connector', icon: 'people', color: '#10B981' },
  { id: 'Gourmet', icon: 'restaurant', color: '#F59E0B' },
  { id: 'Chef', icon: 'restaurant-menu', color: '#EF4444' },
  { id: 'Explorer', icon: 'explore', color: '#3498DB' },
  { id: 'Scholar', icon: 'school', color: '#6366F1' },
  { id: 'Maker', icon: 'build', color: '#DB2777' },
  { id: 'Curator', icon: 'collections', color: '#14B8A6' },
  { id: 'Sage', icon: 'auto-stories', color: '#22C55E' },
  { id: 'Tinkerer', icon: 'settings', color: '#64748B' },
  { id: 'Animal Advocate', icon: 'pets', color: '#FB923C' },
  { id: 'Wanderer', icon: 'terrain', color: '#0EA5E9' },
  { id: 'Digital Nomad', icon: 'laptop', color: '#06B6D4' },
];

const AvatarSelection: React.FC<AvatarSelectionProps> = ({
  selectedAvatar,
  onSelectAvatar,
  displayName,
  onUpdateDisplayName,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Avatar Type</Text>
      <Text style={styles.subtitle}>
        Your avatar reflects how you engage with your hobbies
      </Text>
      
      <View style={styles.displayNameContainer}>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={onUpdateDisplayName}
          placeholder="Enter your display name"
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
        />
      </View>
      
      <FlatList
        data={AVATAR_TYPES}
        numColumns={3}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.avatarItem,
              selectedAvatar === item.id && styles.selectedAvatarItem,
            ]}
            onPress={() => onSelectAvatar(item.id)}
          >
            <View 
              style={[
                styles.avatarIcon, 
                { backgroundColor: item.color }
              ]}
            >
              <MaterialIcons name={item.icon as any} size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.avatarName}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
      
      <View style={styles.selectedAvatarDescription}>
        <Text style={styles.avatarDescriptionTitle}>
          {selectedAvatar}: 
        </Text>
        <Text style={styles.avatarDescription}>
          {getAvatarDescription(selectedAvatar)}
        </Text>
      </View>
    </View>
  );
};

const getAvatarDescription = (avatarType: string): string => {
  const descriptions: Record<string, string> = {
    'Competitor': 'You thrive on challenge and competition, always pushing yourself to new heights.',
    'Visionary': 'You see possibilities where others see obstacles, imagining new paths forward.',
    'Maestro': 'You have a natural talent for expression, bringing creativity to everything you do.',
    'Strategist': 'You enjoy planning and problem-solving, finding elegant solutions to complex challenges.',
    'Connector': 'You build community and forge meaningful relationships wherever you go.',
    'Gourmet': 'You appreciate the finer things, savoring experiences with all your senses.',
    'Chef': 'You create delicious experiences, nourishing others through your culinary talents.',
    'Explorer': 'You seek adventure and discovery, always curious about what lies beyond the horizon.',
    'Scholar': 'You pursue knowledge with passion, constantly expanding your understanding.',
    'Maker': 'You build and create with your hands, finding joy in tangible accomplishments.',
    'Curator': 'You collect and organize with discernment, appreciating quality and craftsmanship.',
    'Sage': 'You seek wisdom and share insights, helping others find their path.',
    'Tinkerer': 'You love to take things apart and understand how they work, always improving.',
    'Animal Advocate': 'You connect deeply with animals, championing their welfare and needs.',
    'Wanderer': 'You follow your own path, embracing freedom and spontaneous discovery.',
    'Digital Nomad': 'You blend technology and lifestyle, creating work-life harmony anywhere.',
  };
  
  return descriptions[avatarType] || 'Select an avatar type to see its description.';
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 24,
  },
  displayNameContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  avatarItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    margin: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatarItem: {
    borderColor: '#3498DB',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  avatarIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  selectedAvatarDescription: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  avatarDescriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  avatarDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});

export default AvatarSelection;