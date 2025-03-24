import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HobbyDetailScreen from '../../src/screens/hobbies/HobbyDetailScreen';

export default function HobbyDetail() {
  const router = useRouter();
  const { hobbyId } = useLocalSearchParams();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
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
  
  return <HobbyDetailScreen />; //navigation={navigationProp} 
}