import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: true,
      presentation: 'modal'
    }}>
      <Stack.Screen name="create-event" options={{ title: 'Create Event' }} />
      <Stack.Screen name="event-detail" options={{ title: 'Event Details' }} />
      <Stack.Screen name="hobby-detail" options={{ title: 'Hobby Details' }} />
      <Stack.Screen name="user-profile" options={{ title: 'User Profile' }} />
      <Stack.Screen 
        name="camera" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal'
        }} 
      />
      <Stack.Screen 
        name="audio" 
        options={{ 
          headerShown: false,
          presentation: 'fullScreenModal'
        }} 
      />
    </Stack>
  );
}