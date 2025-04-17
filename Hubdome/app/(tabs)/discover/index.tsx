import React from 'react';
import { useRouter } from 'expo-router';
import DiscoverScreen from '../../../src/screens/discover/DiscoverScreen';

export default function Discover() {
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
        case 'HobbyDetail':
          router.push({
            pathname: `../(modals)/hobby-detail`,
            params: params
          });
          break;
        case 'Camera':
          router.push(`../(modals)/camera`);
          break;
        case 'Audio':
          router.push(`../(modals)/audio`);
          break;
        case 'CreateEvent':
          router.push(`../(modals)/create-event`);
          break;
        default:
          router.push(`./(tabs)/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  return <DiscoverScreen />; //navigation={navigationProp} is an intrinsic type
}