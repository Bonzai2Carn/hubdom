// src/screens/onboarding/NotificationPreferences.tsx
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface NotificationPreferenceItem {
  key: string;
  title: string;
  description: string;
  icon: string;
}

interface NotificationPreferencesProps {
  preferences: {
    events: boolean;
    messages: boolean;
    nearbyActivities: boolean;
  };
  onUpdatePreferences: (preferences: {
    events: boolean;
    messages: boolean;
    nearbyActivities: boolean;
  }) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  preferences,
  onUpdatePreferences,
}) => {
  const preferenceItems: NotificationPreferenceItem[] = [
    {
      key: 'events',
      title: 'Event Notifications',
      description: 'Get notified about event updates, invitations, and reminders',
      icon: 'event',
    },
    {
      key: 'messages',
      title: 'Message Notifications',
      description: 'Get notified when someone messages you',
      icon: 'message',
    },
    {
      key: 'nearbyActivities',
      title: 'Nearby Activities',
      description: 'Get notified about activities happening near you',
      icon: 'place',
    },
  ];

  const handleToggle = (key: string, value: boolean) => {
    onUpdatePreferences({
      ...preferences,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Preferences</Text>
      <Text style={styles.subtitle}>
        Customize how you want to be notified about activities
      </Text>

      {preferenceItems.map((item) => (
        <View key={item.key} style={styles.preferenceItem}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={item.icon as any} size={24} color="#3498DB" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
          <Switch
            value={preferences[item.key as keyof typeof preferences]}
            onValueChange={(value) => handleToggle(item.key, value)}
            trackColor={{ false: '#767577', true: '#3498DB' }}
            thumbColor={
              preferences[item.key as keyof typeof preferences]
                ? '#FFFFFF'
                : '#f4f3f4'
            }
          />
        </View>
      ))}
    </View>
  );
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
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default NotificationPreferences;