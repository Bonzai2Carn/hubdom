import { Stack } from 'expo-router';

export default function DiscoverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="content-detail" 
        options={{ 
          presentation: 'modal',
          headerShown: true,
          title: 'Content Details'
        }} 
      />
    </Stack>
  );
}