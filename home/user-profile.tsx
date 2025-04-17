import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import UserProfileScreen from '../../../Hubdome/src/screens/users/UserProfileScreen';

export default function UserProfile() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  
  // Create a navigation prop compatible with the existing component
  const navigationProp = {
    navigate: (screen: string, params?: any) => {
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
  
  return <UserProfileScreen />; //navigation={navigationProp} 
}