import React from 'react';
import { useRouter } from 'expo-router';
import EventsScreen from '../../../src/screens/events/EventsScreen';

export default function Events() {
  const router = useRouter();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      // Map the old navigation paths to Expo Router paths
      switch (screen) {
        case 'EventDetail':
          router.push({
            pathname: `../(modals)/event-detail`,
            params: params
          });
          break;
        case 'CreateEvent':
          router.push(`../(modals)/create-event`);
          break;
        case 'EditProfile':
          router.push(`./(tabs)/profile/edit-profile`);
          break;
        default:
          router.push(`./(tabs)/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  return <EventsScreen />; //IntrinsicAttributes => navigation={navigationProp}
}