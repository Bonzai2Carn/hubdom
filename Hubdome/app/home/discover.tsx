import React from 'react';
import DiscoverScreen from '../../src/screens/discover/DiscoverScreen';
import { useRouter } from 'expo-router';

export default function Discover() {
  const router = useRouter();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      // Map the old navigation paths to Expo Router paths
      if (screen.includes('Detail')) {
        router.push({
          pathname: `./home/${screen.toLowerCase().replace('detail', '-detail')}`,
          params: params
        });
      } else {
        router.push(`./home/${screen.toLowerCase()}`);
      }
    },
    goBack: () => router.back()
  };
  
  return <DiscoverScreen />;
}