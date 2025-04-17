import React from 'react';
import DiscoverScreen from '../../../Hubdome/src/screens/discover/DiscoverScreen';
import { useRouter } from 'expo-router';

export default function Discover() {
  const router = useRouter();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
      // Map the old navigation paths to Expo Router paths
      if (screen.includes('Detail')) {
        router.push({
          pathname: `./${screen.toLowerCase().replace('detail', '-detail')}`, //removed /home/
          params: params
        });
      } else {
        router.push(`./${screen.toLowerCase()}`); //removed /home/
      }
    },
    goBack: () => router.back()
  };
  
  return <DiscoverScreen />;
}