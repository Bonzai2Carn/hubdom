import React from 'react';
import MapScreen from '../../../Hubdome/src/screens/home/MapScreen';
import { useRouter } from 'expo-router';

export default function Map() {
  const router = useRouter();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      // Map the old navigation paths to Expo Router paths
      switch (screen) {
        case 'EventDetail':
          router.push({
            pathname: './event-detail',
            params: params
          });
          break;
        case 'HobbyDetail':
          router.push({
            pathname: './hobby-detail',
            params: params
          });
          break;
        case 'UserProfile':
          router.push({
            pathname: './user-profile',
            params: params
          });
          break;
        case 'Camera':
          router.push('./camera');
          break;
        case 'Audio':
          router.push('./audio');
          break;
        default:
          router.push(`./${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  return <MapScreen navigation={navigationProp} />;
}