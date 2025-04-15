import React from 'react';
import EventsScreen from '../../../Hubdome/src/screens/events/EventsScreen';
import { useRouter } from 'expo-router';

export default function Events() {
  const router = useRouter();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      // Map the old navigation paths to Expo Router paths
      if (screen.includes('Detail')) {
        router.push({
          pathname: `./${screen.toLowerCase().replace('detail', '-detail')}`,
          params: params
        });
      } else {
        router.push(`./${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  return <EventsScreen />; //navigation={navigationProp} 
}