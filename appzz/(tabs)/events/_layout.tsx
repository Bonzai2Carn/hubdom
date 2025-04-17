import { Stack } from 'expo-router';

export default function EventsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="event-detail" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Event Details'
        }} 
      />
    </Stack>
  );
}