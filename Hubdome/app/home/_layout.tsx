import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, usePathname, useRouter } from 'expo-router';
import BottomNavigation, { TabName } from '../../src/components/navigations/BottomNavigation';
import CreateEventModal from '../../src/components/events/CreateEventModal';

export default function HomeLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Determine active tab from the current path
  const getActiveTabFromPath = (): TabName => {
    if (pathname.includes('/map')) return 'map';
    if (pathname.includes('/discover')) return 'discover';
    if (pathname.includes('/events')) return 'events';
    if (pathname.includes('/comms')) return 'comms';
    if (pathname.includes('/profile')) return 'profile';
    return 'map'; // Default
  };

  // Handle tab changes
  const handleTabChange = (tab: TabName) => {
    router.push(`./home/${tab}`);
  };

  // Handle create button click
  const handleCreatePress = () => {
    setIsCreateModalOpen(true);
  };

  // Handle event creation
  const handleCreateEvent = (data: any) => {
    // Logic for creating an event
    console.log('Creating event with data:', data);
    setIsCreateModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="map" />
        <Stack.Screen name="discover" />
        <Stack.Screen name="events" />
        <Stack.Screen name="comms" />
        <Stack.Screen name="profile" />
        
        {/* Shared screens that appear on top of the main flow */}
        <Stack.Screen name="event-detail" options={{ presentation: 'modal' }} />
        <Stack.Screen name="hobby-detail" options={{ presentation: 'modal' }} />
        <Stack.Screen name="user-profile" options={{ presentation: 'modal' }} />
      </Stack>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={getActiveTabFromPath()}
        onTabChange={handleTabChange}
        onCreateClick={handleCreatePress}
      />

      {/* Create Event Modal */}
      <CreateEventModal
        isVisible={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2A',
  },
});