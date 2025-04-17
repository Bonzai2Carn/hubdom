import React from 'react';
import { useRouter } from 'expo-router';
import MapScreen from '../../../src/screens/home/MapScreen';

export default function Map() {
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
        case 'UserProfile':
          router.push({
            pathname: `../(modals)/user-profile`,
            params: params
          });
          break;
        case 'CreateEvent':
          router.push(`../(modals)/create-event`);
          break;
        case 'Camera':
          router.push(`../(modals)/camera`);
          break;
        case 'Audio':
          router.push(`../(modals)/audio`);
          break;
        default:
          router.push(`./(tabs)/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  return <MapScreen navigation={navigationProp} />;
}